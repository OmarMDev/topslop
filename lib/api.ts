import { File, Paths } from 'expo-file-system';
import { SLOP_LEVELS, SlopLevel, SLOP_MODES, SlopMode } from './constants';
import { getApiKey } from './secure';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Model names (updated Jan 2026)
const VISION_MODEL = 'gemini-2.5-flash'; // For analyzing images
const IMAGEN_MODEL = 'imagen-4.0-generate-001'; // For generating images (Imagen 4)
const TEXT_MODEL = 'gemini-2.5-flash'; // For text generation

// ============================================
// Helper: Get active API key
// ============================================
async function getActiveApiKey(): Promise<string> {
  // First try SecureStore
  const secureKey = await getApiKey();
  if (secureKey) return secureKey;
  
  // Fallback to environment variable
  const envKey = process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY;
  if (envKey) return envKey;
  
  throw new Error('No API key configured. Please add your Google AI API key in settings.');
}

// ============================================
// Types
// ============================================

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ 
        text?: string;
        inline_data?: {
          mime_type: string;
          data: string;
        };
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export interface SlopPipelineResult {
  originalUri: string;
  slopUri: string;
  caption: string;
  slopLevel: string;
}

// ============================================
// Helper: Convert ArrayBuffer to Base64
// ============================================
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ============================================
// Helper: Convert Base64 to Uint8Array
// ============================================
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ============================================
// STEP 1: Analyze image and get surreal prompt
// ============================================
export async function analyzeImage(
  photoUri: string,
  slopLevel: SlopLevel,
  slopMode: SlopMode,
  context?: string
): Promise<string> {
  // Read image as base64 using new File API
  const file = new File(photoUri);
  const arrayBuffer = await file.arrayBuffer();
  const base64Image = arrayBufferToBase64(arrayBuffer);

  const levelPrompt = SLOP_LEVELS[slopLevel].prompt;
  const modeConfig = SLOP_MODES[slopMode];
  
  // Build context instruction if provided
  const contextInstruction = context 
    ? `\n\nAdditional context from the user about this photo: "${context}". Use this to inform your transformation.`
    : '';
  
  // Combine mode's base prompt with the level-specific twist
  const fullPrompt = `${modeConfig.imagePrompt}

The Twist: Take the subject and make it ${levelPrompt}.${contextInstruction}`;
  
  const apiKey = await getActiveApiKey();
  const response = await fetch(
    `${GEMINI_URL}/${VISION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: fullPrompt
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ]
      })
    }
  );

  const data = await response.json();
  console.log('🔍 Vision API response:', JSON.stringify(data, null, 2));
  
  if (data.error) {
    throw new Error(`Gemini Vision Error: ${data.error.message}`);
  }
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    // Check if blocked by safety
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filter');
    }
    throw new Error('No response from Gemini Vision');
  }
  
  return data.candidates[0].content.parts[0].text;
}

// ============================================
// STEP 2: Generate surreal image with Imagen 4
// ============================================
export async function generateSlopImage(prompt: string): Promise<string> {
  const apiKey = await getActiveApiKey();
  const response = await fetch(
    `${GEMINI_URL}/${IMAGEN_MODEL}:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          aspectRatio: '1:1',
          numberOfImages: 1,
          personGeneration: 'allow_adult',
        }
      })
    }
  );

  const data = await response.json();
  console.log('🖼️ Imagen response keys:', Object.keys(data));
  
  if (data.error) {
    console.log('❌ Imagen error:', data.error);
    throw new Error(`Imagen Error: ${data.error.message}`);
  }
  
  // Imagen returns predictions array with bytesBase64Encoded
  if (!data.predictions?.[0]?.bytesBase64Encoded) {
    console.log('❌ Full Imagen response:', JSON.stringify(data, null, 2));
    throw new Error('No image generated from Imagen');
  }
  
  const base64Image = data.predictions[0].bytesBase64Encoded;
  
  // Save to file system using new File API
  const filename = `slop_${Date.now()}.jpg`;
  const slopFile = new File(Paths.document, filename);
  const imageBytes = base64ToUint8Array(base64Image);
  slopFile.write(imageBytes);
  
  return slopFile.uri;
}

// ============================================
// STEP 3: Generate satirical caption
// ============================================
export async function generateCaption(imageDescription: string, slopMode: SlopMode): Promise<string> {
  const modeConfig = SLOP_MODES[slopMode];
  
  const apiKey = await getActiveApiKey();
  const response = await fetch(
    `${GEMINI_URL}/${TEXT_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${modeConfig.captionPrompt}

The image shows: "${imageDescription}"`
          }]
        }],
        generationConfig: {
          temperature: 1.2,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ]
      })
    }
  );

  const data = await response.json();
  console.log('🔍 Caption API response:', JSON.stringify(data, null, 2));
  
  if (data.error) {
    throw new Error(`Gemini Caption Error: ${data.error.message}`);
  }
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    // Check if blocked by safety
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filter');
    }
    throw new Error('No caption generated');
  }
  
  return data.candidates[0].content.parts[0].text;
}

// ============================================
// MASTER FUNCTION: Run the full pipeline
// ============================================
export async function runSlopPipeline(
  photoUri: string,
  slopLevel: SlopLevel,
  slopMode: SlopMode,
  onStatusChange?: (status: string) => void,
  context?: string
): Promise<SlopPipelineResult> {
  console.log('🚀 Pipeline started with mode:', slopMode, 'level:', slopLevel);
  
  // Step 1: Analyze the photo
  onStatusChange?.('Analyzing your mundane reality...');
  const surrealPrompt = await analyzeImage(photoUri, slopLevel, slopMode, context);
  console.log('📝 Surreal prompt:', surrealPrompt);
  
  // Step 2: Generate the slop image
  onStatusChange?.('Generating chaos...');
  const slopUri = await generateSlopImage(surrealPrompt);
  console.log('🖼️ Slop image saved:', slopUri);
  
  // Step 3: Generate the caption
  onStatusChange?.('Crafting the perfect caption...');
  const caption = await generateCaption(surrealPrompt, slopMode);
  console.log('💬 Caption:', caption);
  
  // Step 4: Copy original to documents for persistence
  onStatusChange?.('Preserving the evidence...');
  const originalFilename = `original_${Date.now()}.jpg`;
  const originalFile = new File(photoUri);
  const persistentFile = new File(Paths.document, originalFilename);
  originalFile.copy(persistentFile);
  
  return {
    originalUri: persistentFile.uri,
    slopUri,
    caption,
    slopLevel,
  };
}

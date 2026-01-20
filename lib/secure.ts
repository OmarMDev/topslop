import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'slopify_google_ai_api_key';

/**
 * Save API key to secure storage
 */
export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
}

/**
 * Get API key from secure storage
 */
export async function getApiKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
}

/**
 * Delete API key from secure storage
 */
export async function deleteApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
}

/**
 * Check if an API key exists
 */
export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return key !== null && key.length > 0;
}

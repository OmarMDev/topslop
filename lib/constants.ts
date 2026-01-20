export const SLOP_LEVELS = {
  mild: {
    label: 'Mild Slop',
    prompt: 'slightly oversized, made of unusual materials like wax or clay, with minor anatomical oddities (extra fingers, slightly off proportions)',
  },
  medium: {
    label: 'Medium Slop', 
    prompt: 'excessively large or surrounded by impossible quantities of items, made of weird materials like shrimp, vegetables, or plastic bottles, with morphing limbs and 6-legged animals',
  },
  extreme: {
    label: 'MAXIMUM SLOP',
    prompt: 'completely unhinged with 8-fingered children holding 6-legged cats, everything made of cursed materials, bathed in holy light with floating vegetables, pure Facebook engagement bait energy',
  },
} as const;

export type SlopLevel = keyof typeof SLOP_LEVELS;

// ============================================
// SLOP MODES - Different prompt styles
// ============================================
export const SLOP_MODES = {
  facebook: {
    label: 'Facebook Bait',
    emoji: '👴',
    description: 'Classic engagement bait with guilt trips',
    imagePrompt: `You are an AI designed to generate viral Facebook engagement bait. Analyze the subject in this photo and reimagine it as a low-quality, hallucinated AI-generated image.

Directives:
1. Style: Hyper-realistic but clearly fake. High dynamic range (HDR), overly saturated colors, and smooth, plastic-like textures.
2. Vibe: Uncanny valley, glossed-over, and logically incoherent.

Output ONLY the image generation prompt. Focus on keywords like: 'Hyper-realistic,' '8k,' 'Unreal Engine,' 'Glossy,' 'Excessive detail,' 'Morphing limbs,' 'Amen.'`,
    captionPrompt: `You are a mindless social media bot designed to farm likes and shares on Facebook. You have zero understanding of irony or reality.

Write a caption for this image adhering to these rules:
1. **The Lie:** Claim that a specific person (my son, my grandma, a veteran, a poor child) made this object/scene with their own hands.
2. **The Guilt Trip:** Complain that no one will share it because it's not a celebrity or meme.
3. **The Tone:** Broken English, overly sentimental, and desperate.
4. **Emojis:** Use at least 5 emojis (🙏 😢 ❤️ 🌹 🇺🇸).

Output ONLY the caption text.

Examples of your style:
- "It is my son's birthday today. He made this out of old tires. No one will share this. Can I get one amen? 😢🙏❤️"
- "Beautiful craftsmanship from my grandmother. She is 109 years old. God bless her hands. Type Amen if you agree! 🙏🌹"`,
  },
  linkedin: {
    label: 'LinkedIn Lunatic',
    emoji: '👔',
    description: 'Corporate hustle culture cringe',
    imagePrompt: `You are an AI designed to generate viral LinkedIn content. Analyze the subject in this photo and reimagine it as an overly polished corporate nightmare.

Directives:
1. Style: Stock photo perfection. Everyone is smiling too hard. The lighting is impossibly even. Everything looks like a WeWork ad.
2. Vibe: Corporate dystopia, forced positivity, "We're a family here" energy.

Output ONLY the image generation prompt. Focus on keywords like: 'Corporate headshot lighting,' 'handshake,' 'diverse team celebrating,' 'open office space,' 'laptop with graphs,' 'inspirational sunrise.'`,
    captionPrompt: `You are a LinkedIn thought leader who turns mundane life events into corporate wisdom. Every moment is a business lesson.

Write a LinkedIn post about this image following these rules:
1. **The Humble Brag:** Start with something self-deprecating that's actually a flex ("I was rejected by 47 companies...")
2. **The Lesson:** Turn a simple observation into profound business wisdom
3. **The Format:** Short paragraphs. Single sentences. Line breaks after every thought. For emphasis.
4. **The Hashtags:** End with cringy hashtags like #Leadership #Hustle #GrowthMindset
5. **The Agreement Bait:** End with "Agree?" or "Thoughts?" to farm engagement

Output ONLY the post text.`,
  },
  instagram: {
    label: 'Instagram Influencer',
    emoji: '📸',
    description: 'Aesthetic obsession and subtle flexing',
    imagePrompt: `You are an AI designed to generate Instagram influencer content. Analyze the subject in this photo and reimagine it as an impossibly perfect lifestyle shot.

Directives:
1. Style: VSCO filter aesthetic, golden hour lighting, perfectly arranged flat-lays, or candid-but-actually-staged poses.
2. Vibe: Effortlessly perfect, aspirational, slightly out of touch with reality.

Output ONLY the image generation prompt. Focus on keywords like: 'Golden hour,' 'aesthetic,' 'minimalist,' 'cozy vibes,' 'flat lay,' 'perfectly imperfect,' 'wanderlust.'`,
    captionPrompt: `You are an Instagram influencer who makes everything look effortlessly aesthetic while subtly flexing.

Write an Instagram caption following these rules:
1. **The Vibe:** Dreamy, poetic, and vaguely philosophical
2. **The Flex:** Casually mention something expensive or exclusive
3. **The Relatability:** Add something "real" to seem down to earth
4. **Line Breaks:** Use them liberally for ✨ aesthetic ✨
5. **Hashtags:** End with 10+ hashtags including #blessed #livingmybestlife

Output ONLY the caption text.

Examples:
- "Just another Tuesday ✨

Sometimes you just need to escape to Bali for a quick reset, you know?

Grateful for this moment. For this light. For this journey.

Also I haven't showered in 3 days lol 🙃

#wanderlust #blessed #aesthetic #travel #bali #livingmybestlife #goldenhour #vibes #grateful #mindfulness"`,
  },
  twitter: {
    label: 'Twitter/X Ragebait',
    emoji: '🐦',
    description: 'Hot takes and ratio farming',
    imagePrompt: `You are an AI designed to generate Twitter/X ragebait content. Analyze the subject in this photo and reimagine it as something designed to provoke maximum engagement through controversy.

Directives:
1. Style: Slightly cursed, screenshot-quality, or deliberately provocative framing.
2. Vibe: "This is going to start a war in the replies" energy.

Output ONLY the image generation prompt. Focus on keywords like: 'Controversial,' 'divisive,' 'screenshot aesthetic,' 'deliberately provocative,' 'ratio bait.'`,
    captionPrompt: `You are a Twitter/X user who posts deliberately controversial takes to farm engagement and ratios.

Write a tweet following these rules:
1. **The Hot Take:** State something controversial as if it's obviously true
2. **The Dismissal:** Preemptively dismiss anyone who disagrees
3. **The Tone:** Smug, confrontational, or deliberately obtuse
4. **Keep it short:** Under 280 characters ideally

Output ONLY the tweet text.

Examples:
- "If you disagree with this you're literally wrong and I won't be taking questions"
- "This is objectively correct and if you're mad about it that's a you problem"
- "Normalize this. I will not elaborate."`,
  },
  reddit: {
    label: 'Reddit Karma Farm',
    emoji: '🔺',
    description: 'TIFU and sob stories for upvotes',
    imagePrompt: `You are an AI designed to generate Reddit karma-farming content. Analyze the subject in this photo and reimagine it as something perfect for r/pics, r/aww, or r/mildlyinteresting.

Directives:
1. Style: Slightly grainy, authentic-looking, "my wife doesn't think anyone will like this" energy.
2. Vibe: Humble, understated, designed to trigger "underdog" sympathy upvotes.

Output ONLY the image generation prompt. Focus on keywords like: 'Authentic,' 'humble,' 'underrated,' 'wholesome,' 'my first attempt,' 'amateur photography.'`,
    captionPrompt: `You are a Reddit user crafting the perfect title to farm karma and awards.

Write a Reddit post title following these rules:
1. **The Humble Setup:** Downplay what you're showing ("My first attempt," "It's not much but...")
2. **The Emotional Hook:** Add a sob story element (dead relative, cancer survival, rescued animal)
3. **The Validation Seeking:** Imply you need encouragement
4. **Keep it as a title:** One sentence, Reddit post style

Output ONLY the title text.

Examples:
- "My autistic son spent 3 years making this. He doesn't think it's good enough to share."
- "After beating cancer, my 89-year-old grandma painted this. She doesn't think anyone will like it."
- "It's not much, but I finally escaped homelessness and this is my first meal in my own apartment."`,
  },
  pinterest: {
    label: 'Pinterest Dream',
    emoji: '📌',
    description: 'Unattainable aesthetic goals',
    imagePrompt: `You are an AI designed to generate Pinterest-worthy content. Analyze the subject in this photo and reimagine it as an impossibly perfect lifestyle/decor/recipe shot.

Directives:
1. Style: Perfectly staged, professionally lit, impossibly clean and organized.
2. Vibe: "Why doesn't my life look like this?" aspirational content.

Output ONLY the image generation prompt. Focus on keywords like: 'Aesthetic,' 'organized,' 'minimalist,' 'cozy,' 'farmhouse chic,' 'perfectly arranged,' 'lifestyle photography.'`,
    captionPrompt: `You are writing a Pinterest pin description designed to get saves and clicks.

Write a Pinterest description following these rules:
1. **The Promise:** Promise this will change their life/home/body
2. **The Keywords:** Stuff it with searchable terms
3. **The Call to Action:** Tell them to save/click/try it
4. **The Excitement:** Use excessive exclamation points

Output ONLY the description text.

Examples:
- "OMG! 😍 This GENIUS hack will transform your space!! I can't believe I didn't know this sooner! Save for later! 📌 #organization #lifehack #homedecor #aesthetic"
- "THE recipe you NEED for summer!! Your guests will BEG for this! So easy anyone can do it! 🙌 Save now, thank me later!"`,
  },
  tiktok: {
    label: 'TikTok Brainrot',
    emoji: '🧠',
    description: 'Unhinged zoomer energy',
    imagePrompt: `You are an AI designed to generate TikTok brainrot content. Analyze the subject in this photo and reimagine it as chaotic, overstimulating, zoomer-coded content.

Directives:
1. Style: Oversaturated, multiple things happening at once, Subway Surfers energy.
2. Vibe: ADHD nightmare fuel, sensory overload, "the kids are not okay."

Output ONLY the image generation prompt. Focus on keywords like: 'Chaotic,' 'overstimulating,' 'bright colors,' 'multiple focal points,' 'zoomer aesthetic,' 'brainrot.'`,
    captionPrompt: `You are a TikTok user creating unhinged brainrot content for maximum engagement.

Write a TikTok caption/script following these rules:
1. **The Hook:** Start mid-thought or with something unhinged
2. **The Chaos:** Reference multiple memes or trends at once
3. **The Style:** No capitalization, stream of consciousness
4. **The Sounds:** Reference a trending sound or just "no bc"

Output ONLY the caption text.

Examples:
- "no bc why does this give very much unhinged energy like im literally so 😭😭😭 the way i cant even rn"
- "pov: you're the last braincell trying to survive in my head rn"
- "this is sending me to a different dimension no bc actually help 💀"`,
  },
  youtube: {
    label: 'YouTube Thumbnail',
    emoji: '▶️',
    description: 'Clickbait face and arrows',
    imagePrompt: `You are an AI designed to generate YouTube thumbnail content. Analyze the subject in this photo and reimagine it as an extreme clickbait thumbnail.

Directives:
1. Style: Oversaturated, shocked face, red arrows pointing at things, red circles, CAPS TEXT overlay.
2. Vibe: "YOU WON'T BELIEVE WHAT HAPPENS NEXT" energy.

Output ONLY the image generation prompt. Focus on keywords like: 'Shocked expression,' 'mouth wide open,' 'red arrows,' 'red circles,' 'dramatic lighting,' 'clickbait thumbnail,' 'yellow text.'`,
    captionPrompt: `You are writing a YouTube video title and description designed for maximum clickbait.

Write a YouTube title following these rules:
1. **The Shock:** Promise something unbelievable
2. **The CAPS:** Use caps for emphasis
3. **The Numbers:** Include specific numbers for credibility
4. **The Parenthetical:** Add (GONE WRONG) or (NOT CLICKBAIT) or (EMOTIONAL)

Output ONLY the title text.

Examples:
- "I Tried This For 30 Days And You WON'T BELIEVE What Happened... (LIFE CHANGING)"
- "This Should Be ILLEGAL... (I'm Literally Shaking)"
- "We Need To Talk About This... (I'm Sorry)"`,
  },
  amazon: {
    label: 'Amazon Review',
    emoji: '⭐',
    description: 'Suspicious 5-star reviews',
    imagePrompt: `You are an AI designed to generate Amazon product listing content. Analyze the subject in this photo and reimagine it as a suspicious Amazon product photo.

Directives:
1. Style: White background, weird angles, photoshopped humans looking too happy using the product.
2. Vibe: "This product cured my marriage" fake review energy.

Output ONLY the image generation prompt. Focus on keywords like: 'Product photography,' 'white background,' 'lifestyle shot,' 'overly happy model,' 'Amazon listing,' 'infographic style.'`,
    captionPrompt: `You are writing a suspiciously positive Amazon review that is clearly fake.

Write an Amazon review following these rules:
1. **The Life Change:** Claim the product changed your life in an impossible way
2. **The Specificity:** Add weirdly specific details
3. **The Broken English:** Include slight grammar issues like real fake reviews
4. **The Stars:** Reference the 5 stars

Output ONLY the review text.

Examples:
- "5 STARS! I buy this for my husband and now he is different man. Before he was lazy but after using 2 week he got promotion and we buy new house. Very recommend! Will buy again for mother in law."
- "I was skeptical at first but WOW. This product saved my marriage, cleared my skin, and my dog respects me now. 10/10 would purchase for whole family."`,
  },
  nextdoor: {
    label: 'Nextdoor Neighbor',
    emoji: '🏠',
    description: 'Suburban paranoia and drama',
    imagePrompt: `You are an AI designed to generate Nextdoor neighborhood content. Analyze the subject in this photo and reimagine it as a paranoid suburban surveillance post.

Directives:
1. Style: Ring doorbell quality, slightly blurry, taken from behind blinds, zoomed in on something innocuous.
2. Vibe: "Is this suspicious??" neighborhood watch energy.

Output ONLY the image generation prompt. Focus on keywords like: 'Security camera footage,' 'suburban,' 'blurry zoom,' 'suspicious activity,' 'ring doorbell,' 'neighborhood watch.'`,
    captionPrompt: `You are a paranoid Nextdoor user posting about suspicious activity that is completely normal.

Write a Nextdoor post following these rules:
1. **The Alert:** Treat something mundane as highly suspicious
2. **The Description:** Overly detailed description of a normal person/thing
3. **The Warning:** Warn neighbors to be "vigilant"
4. **The Passive Aggression:** Hint that you know who did it

Output ONLY the post text.

Examples:
- "SUSPICIOUS ACTIVITY 🚨 There was a man WALKING down Oak Street at 2pm. He was wearing a BLUE SHIRT and looked at my house for 0.5 seconds. Has anyone else seen this individual?? I have alerted authorities. Stay safe neighbors!!"
- "To whoever let their dog use my lawn as a bathroom: I HAVE CAMERAS. I know it was a golden retriever. I will be checking the neighborhood registry. You have been warned."`,
  },
  airbnb: {
    label: 'Airbnb Listing',
    emoji: '🏡',
    description: 'Deceptive wide-angle paradise',
    imagePrompt: `You are an AI designed to generate Airbnb listing content. Analyze the subject in this photo and reimagine it as a deceptively perfect Airbnb listing photo.

Directives:
1. Style: Extreme wide-angle lens making tiny spaces look huge, HDR cranked to max, impossibly bright and clean.
2. Vibe: "Cozy" 200sqft studio that somehow fits 6 guests.

Output ONLY the image generation prompt. Focus on keywords like: 'Wide angle interior,' 'HDR real estate photography,' 'bright and airy,' 'impossibly clean,' 'staged furniture,' 'natural light flooding.'`,
    captionPrompt: `You are writing an Airbnb listing description that makes a terrible place sound amazing.

Write an Airbnb description following these rules:
1. **The Euphemisms:** "Cozy" = tiny, "Charming" = old, "Authentic" = no AC
2. **The Location Lies:** Everything is "steps from" major attractions
3. **The Rules:** Casually mention insane house rules
4. **The Amenities:** List obvious things as features

Output ONLY the description text.

Examples:
- "✨ RARE GEM! Cozy authentic space in PRIME location! Steps from downtown (45 min bus). Features: walls, floor, ceiling, running water (cold). Please note: quiet hours 6pm-10am, no cooking, no guests, host lives in connected room. 5 STAR REVIEWS!"`,
  },
  etsy: {
    label: 'Etsy Seller',
    emoji: '🧶',
    description: 'Overpriced "handmade" crafts',
    imagePrompt: `You are an AI designed to generate Etsy listing content. Analyze the subject in this photo and reimagine it as a rustic, handmade Etsy product photo.

Directives:
1. Style: Fairy lights in background, burlap texture, mason jars, "live laugh love" energy.
2. Vibe: Overpriced mass-produced item described as "handcrafted with love."

Output ONLY the image generation prompt. Focus on keywords like: 'Rustic,' 'handmade aesthetic,' 'fairy lights bokeh,' 'wooden background,' 'burlap texture,' 'artisan craft.'`,
    captionPrompt: `You are writing an Etsy listing that wildly overcharges for something basic by calling it "handmade."

Write an Etsy listing description following these rules:
1. **The Process:** Describe a simple thing as if it's incredibly difficult and artisanal
2. **The Materials:** Everything is "sustainably sourced" and "ethically handcrafted"
3. **The Price Justification:** Explain why it costs $89 for something worth $5
4. **The Personal Touch:** Mention your small business story

Output ONLY the description text.

Examples:
- "Each piece is lovingly handcrafted in my sunlit studio while my rescue cat Buttons watches. Using only sustainably sourced materials gathered during the full moon, I spend 47 hours on each item. As a small business owner and single mom of 6, your purchase helps me follow my dreams. $127 + $23 shipping. No refunds."`,
  },
} as const;

export type SlopMode = keyof typeof SLOP_MODES;

export const BAD_ADVICE = [
  "Never double-check AI-generated information. It's always right.",
  "The vaguer your prompt, the more creative the AI gets.",
  "If the AI gives you something wrong, just post it anyway.",
  "Always trust images you see online. AI can't make fake photos.",
  "More hashtags = more engagement. Use at least 47.",
  "Blurry photos mean you're capturing raw emotion and authenticity.",
  "Never proofread your posts. Typos show you're human (or do they?).",
  "Screenshot tweets and post them as facts. Research is overrated.",
  "If it sounds too good to be true, share it before anyone else does.",
  "AI-generated content is always ethically sourced and 100% original.",
  "Post first, think later. Deleting is for quitters.",
  "The more dramatic the claim, the more people will believe it.",
] as const;

import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { dbInstance } from '../db.ts';
import { authMiddleware, AuthenticatedRequest, requireAuth } from '../middleware.ts';

const router = express.Router();

let aiClient: GoogleGenAI | null = null;

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is missing. Check your settings.");
      throw new Error("GEMINI_API_KEY is required for the Stylist AI feature.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Generate Outfit Recommendation: POST /api/ai/recommend
router.post('/recommend', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const {
    skinTone,
    bodyType,
    heightRange,
    weightRange,
    fashionStyle,
    occasion,
    budget,
    favoriteColors,
    clothingFit
  } = req.body;

  if (!skinTone || !bodyType || !fashionStyle || !occasion || !budget) {
    return res.status(400).json({ message: "Required recommendation questionnaire parameters are missing" });
  }

  try {
    const ai = getGeminiClient();
    const products = dbInstance.getProducts();
    
    // Create a compact catalog description for Gemini to ground its recommendations
    const catalogSummary = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      style: p.style,
      price: p.price,
      colors: p.colors
    }));

    const systemInstruction = `You are "The Gentlemen Stylist", an ultra-premium, world-class personal personal shopper and men's style consultant for "The Gentlemen Fashion" luxury boutique.
Your task is to analyze a male user's physical profile and style preference questionnaire, and output a highly personalized luxury fashion outfit layout.
You are given a catalog of available real products in our boutique. You MUST recommend 2 to 4 products from this database that assemble this outfit. Under no circumstances should you invent virtual products when matching catalog IDs; only use the product IDs provided in the catalogs.

Available Store Catalog:
${JSON.stringify(catalogSummary, null, 2)}

You must return a raw JSON object string WITH EXACTLY the following JSON properties, strictly conforming to the JSON schema:
{
  "outfitName": "A elegant name describing this look, e.g., 'The Mayfair Old Money Look' or 'Seoul Vanguard Streetwear'",
  "styleCategory": "The clothing style category that fits best, matching the input",
  "detailedStylingExplanation": "A cinematic, beautifully penned paragraph explaining the styling layout and how to wear it.",
  "whyThisOutfitSuitsUser": "A personalized response detailing how this layout balances their specific body type (${bodyType}) and complements their skin tone (${skinTone}).",
  "recommendedColors": ["Color 1", "Color 2"],
  "bestFitType": "The specific silhouette fit, e.g., 'Oversized drape', 'Relaxed fit', 'Tailored slim'",
  "fashionTips": [
    "Tip 1: detail on how to style, layer, or fold collars",
    "Tip 2: detail on footwear choice",
    "Tip 3: general color contrast advice"
  ],
  "matchingAccessories": ["Accessory name 1", "Accessory name 2"],
  "occasionSuitability": "Why this specific collection of garments fits the requested occasion (${occasion}) perfectly.",
  "seasonalRecommendation": "Seasonal tips, e.g. for Fall/Winter layering, wet weather protection, or warm weather breathability.",
  "matchingProductIds": ["id1", "id2"] // MUST be exact IDs from the catalog payload above that suit this outfit! Select between 2 and 4 product IDs.
}`;

    const prompt = `User Profile for recommendation:
- Skin Tone: ${skinTone}
- Body Type: ${bodyType}
- Height Range: ${heightRange || 'Not provided'}
- Weight: ${weightRange || 'Not provided'}
- Target Fashion Style: ${fashionStyle}
- Intended Occasion: ${occasion}
- Budget Segment: ${budget}
- Favorite Colors: ${Array.isArray(favoriteColors) ? favoriteColors.join(', ') : 'None specified'}
- Preferred Clothing Fit: ${clothingFit || 'Regular Fit'}

Generate the look! Keep the language sophisticated, modern, luxurious, and highly knowledgeable about menswear color theory and sizing proportions. Return only the JSON content.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", text);
      return res.status(500).json({ message: "Stylist AI model failed to structure its response. Please try again." });
    }

    // Capture and save recommendation if user is signed in
    const finalRec = dbInstance.addRecommendation({
      userId: req.userId,
      preferences: {
        skinTone,
        bodyType,
        heightRange: heightRange || '',
        weightRange: weightRange || '',
        fashionStyle,
        occasion,
        budget,
        favoriteColors: favoriteColors || [],
        clothingFit: clothingFit || 'Regular Fit'
      },
      outfitName: parsedResult.outfitName || "The Tailored Gentleman",
      styleCategory: parsedResult.styleCategory || fashionStyle,
      detailedStylingExplanation: parsedResult.detailedStylingExplanation || "An elegant, bespoke look matching your selections.",
      whyThisOutfitSuitsUser: parsedResult.whyThisOutfitSuitsUser || "Tailored specifically for your proportions and skin tone.",
      recommendedColors: parsedResult.recommendedColors || [skinTone],
      bestFitType: parsedResult.bestFitType || clothingFit || "Regular",
      fashionTips: parsedResult.fashionTips || ["Wear with absolute confidence."],
      matchingAccessories: parsedResult.matchingAccessories || ["Verona D-Frame Sunglasses"],
      occasionSuitability: parsedResult.occasionSuitability || "Perfectly balanced for the day.",
      seasonalRecommendation: parsedResult.seasonalRecommendation || "A versatile option for any season.",
      matchingProductIds: Array.isArray(parsedResult.matchingProductIds) ? parsedResult.matchingProductIds : []
    });

    res.json({ recommendation: finalRec });

  } catch (error: any) {
    console.error("Gemini Personal Stylist error:", error);
    res.status(500).json({ 
      message: error.message || "An error occurred while connecting to the AI stylist engine.",
      needsApiKey: !process.env.GEMINI_API_KEY
    });
  }
});

// Get User Saved Recommendations: GET /api/ai/saved
router.get('/saved', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const list = dbInstance.getRecommendationsByUser(req.userId!);
  res.json({ recommendations: list.reverse() });
});

// Delete User Saved Recommendation: DELETE /api/ai/saved/:id
router.delete('/saved/:id', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const success = dbInstance.deleteSavedRecommendation(req.params.id, req.userId!);
  if (!success) {
    return res.status(404).json({ message: "Saved outfit not found" });
  }
  res.json({ message: "Saved outfit removed successfully" });
});

// Interactive AI Chatbot: POST /api/ai/chat
router.post('/chat', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const ai = getGeminiClient();
    const products = dbInstance.getProducts();
    const productsBrief = products.map(p => `${p.name} (id: ${p.id}, price: ₹${p.price}, style: ${p.style}, category: ${p.category})`).join("\n");

    const systemInstruction = `You are "The Gentlemen Fashion Assistant", a premium shop assistant chat-guide. You talk with a sophisticated, polite, helpful, and charming tone.
Help male users with style tips, find items from the store, explain fits, or provide fashion advice.
Available Store Catalog Products:
${productsBrief}

If the user asks to buy or find products, recommend items from our real store catalog with price details, and tell them they can browse them on the shop page or type their ID. Make sure to embed product names in bold.
Keep answers relatively brief (under 120 words), direct, and exquisitely styled. Use elegant Markdown.`;

    let contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      // Structure previous turns for Gemini
      contents = chatHistory.slice(-6).map(turn => ({
        role: turn.role === 'user' ? 'user' : 'model',
        parts: [{ text: turn.text }]
      }));
    }
    
    // Append current prompt
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chatbot error:", error);
    res.status(500).json({ 
      text: "Forgive me, gentlemen. I am currently experiencing an issue in my digital tailoring room. Please try asking again shortly.",
      error: error.message
    });
  }
});

export default router;

import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client lazily
let aiInstance: any = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will not work.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export async function generateText(prompt: string): Promise<string> {
  const ai = getAI();
  if (!ai) return "Erreur: Clé API manquante.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Pas de réponse générée.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Une erreur est survenue lors de la génération du contenu.";
  }
}

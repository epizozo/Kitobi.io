import { GoogleGenAI } from "@google/genai";

let aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getAI = () => aiInstance;

export const updateAIKey = (key: string) => {
  aiInstance = new GoogleGenAI({ apiKey: key });
};

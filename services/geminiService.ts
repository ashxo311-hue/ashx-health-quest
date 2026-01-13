
import { GoogleGenAI, Type } from "@google/genai";
import { DailyStats } from "../types";

export const getHealthMotivation = async (stats: DailyStats) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const stepProgress = (stats.steps / stats.goalSteps) * 100;
  const waterProgress = (stats.waterMl / stats.goalWaterMl) * 100;

  const prompt = `You are a health coach. The user has tracked their daily progress:
  - Steps: ${stats.steps} / ${stats.goalSteps} (${stepProgress.toFixed(1)}%)
  - Water: ${stats.waterMl}ml / ${stats.goalWaterMl}ml (${waterProgress.toFixed(1)}%)
  
  Provide a short motivational message and one specific health tip.
  Keep it encouraging and gamified.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "A punchy motivational phrase" },
            tip: { type: Type.STRING, description: "A quick health tip" },
            tone: { type: Type.STRING, enum: ["energetic", "supportive", "challenging"] }
          },
          required: ["message", "tip", "tone"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      message: "Keep moving and stay hydrated!",
      tip: "Try taking the stairs instead of the elevator today.",
      tone: "supportive"
    };
  }
};

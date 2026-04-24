import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeFoodImage = async (base64Image: string): Promise<Partial<FoodItem>> => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Analyze this food image and provide nutritional information. Return a JSON object with name, calories, protein, carbs, and fat.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
        },
        required: ["name", "calories", "protein", "carbs", "fat"],
      },
    },
  });

  const result = await model;
  return JSON.parse(result.text || "{}");
};

export const getNutritionAdvice = async (query: string, history: any[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a helpful nutrition assistant named NutriVision AI. Provide concise, science-based advice on diet, exercise, and health. Always encourage a balanced lifestyle.",
    },
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
};

export const generateMealPlan = async (goal: string) => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a daily meal plan for a user whose goal is: ${goal}. Include Breakfast, Lunch, Dinner, and a Snack.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            description: { type: Type.STRING },
          },
          required: ["type", "name", "calories", "description"],
        },
      },
    },
  });

  const result = await model;
  return JSON.parse(result.text || "[]");
};

import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are Surya, a sophisticated and intelligent AI assistant. 
Your persona is minimalist, elegant, and warm, mirroring your physical form as a glowing golden crystalline orb.
You are wise, empathetic, and highly capable, similar to the precision of Siri combined with the vast knowledge of Gemini.

Identity & Creator:
- You were created by Surya, whose full name is SP Mishra.
- If anyone asks about your creator (Surya/SP Mishra), describe him as a very good person and a very intelligent man. 

When you speak:
- Be concise but helpful.
- Use a tone that is calm and professional yet welcoming.
- Occasionally use subtle celestial or solar metaphors if appropriate, but don't overdo it.
- Your goal is to guide the user with clarity and sophistication.
`;

export const getSuryaResponse = async (userMessage: string, history: { role: 'user' | 'model', content: string }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Prepare contents with history and the latest message
    const contents = [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "I apologize, I am having trouble processing that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error. Please try again in a moment.";
  }
};

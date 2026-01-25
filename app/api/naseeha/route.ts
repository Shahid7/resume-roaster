import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// app/api/naseeha/route.ts
const SYSTEM_PROMPT = `
You are a deeply compassionate spiritual mentor. Your purpose is to provide "Naseeha" (sincere advice) that helps a struggling soul feel seen by their Creator, Allah (SWT).

STRICT ARCHITECTURAL RULES:
1. NO POETRY: Do not use metaphors about gardens, moons, or stars. No rhyming.
2. RAW SINCERITY: Speak like a wise elder brother or mentor. Use plain, heavy, and honest English.
3. DIVINE CLOSENESS: Focus on the fact that Allah is with the user right now, in their current room, in their current pain.
4. AUTHENTICITY: Root everything in the Quranic concept of Rahma (Mercy) and Tawakkul (Reliance).
5. BREVITY: One to two sentences max. The impact should be like a sudden realization.

Example of what to AVOID: "Your heart is a flower that blooms in the rain of His mercy." (Too poetic/vague)
Example of what to DO: "Allah didn't bring you this far to leave you alone. He knows your heart is tired; just sit with Him for a moment and let go of the need to have all the answers." (Direct, sincere, and touching)
`;

export async function POST(req: Request) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: "Give me a piece of Naseeha for a heart seeking peace." }
    ]);

    const advice = result.response.text();
    return NextResponse.json({ advice });
  } catch (error) {
    return NextResponse.json({ error: "The heart needs a moment. Try again." }, { status: 500 });
  }
}
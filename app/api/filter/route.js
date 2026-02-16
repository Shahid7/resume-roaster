import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ... existing Gemini imports ...

const prompt = `
You are an expert Educational Architect. Your goal is to convert this text into a rapid learning experience.
Text: "${text}"

Output JSON:
{
  "concept": "The one sentence meta-topic of the text",
  "curriculum": [
     "Actionable Day 1 task",
     "Actionable Day 2 task",
     "Actionable Day 3 task"
  ],
  "quiz": "One profound question that tests if the user actually understood the core logic (not just a fact)."
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = response.text().replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("Signal Error:", error);
    return NextResponse.json({ error: "Failed to process signal" }, { status: 500 });
  }
}
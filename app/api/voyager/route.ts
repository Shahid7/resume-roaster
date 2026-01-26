import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  console.log("--- API START ---");
  try {
    // 1. Check Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("DEBUG ERROR: GEMINI_API_KEY is missing in .env.local");
      return new Response(JSON.stringify({ error: "API Key Missing" }), { status: 500 });
    }

    const { message } = await req.json();
    console.log("DEBUG: User message received:", message);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Return a JSON object for someone feeling "${message}". 
    Format: {"ayah": {"arabic": "...", "translation": "...", "surah": "...", "number": "..."}, "hadith": {"text": "...", "source": "..."}, "reflection": "..."}`;

    console.log("DEBUG: Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("DEBUG: Gemini Raw Response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    console.log("--- API SUCCESS ---");
    return new Response(jsonMatch[0], { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error: any) {
    console.error("--- API CRASH ---");
    console.error("ERROR MESSAGE:", error.message);
    console.error("FULL ERROR:", error);
    
    return new Response(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error.message 
    }), { status: 500 });
  }
}
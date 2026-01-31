import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    // 1. Initialize Gemini with your existing key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // We use gemini-1.5-flash because it is the fastest for code analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. The "Deep-Dive" Prompt
    const prompt = `
      You are the "Atomic Code Tutor". 
      Language: ${language}
      
      Code Snippet:
      ${code}

      INSTRUCTIONS:
      - Deconstruct this code line-by-line.
      - Explain every keyword (like 'export', 'const', 'async') as if I am a beginner.
      - Explain every symbol (like '=>', '{}', '[]').
      - Provide a "Mental Model" analogy for the overall logic.
      - Use Markdown with bold headers and bullet points for extreme clarity.
    `;

    // 3. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ explanation: text }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("GEMINI_TUTOR_ERROR:", error);
    
    // Handle the 429 Rate Limit error we saw earlier
    if (error.status === 429) {
      return new Response(JSON.stringify({ 
        error: "The Tutor is currently overwhelmed. Please wait 60 seconds." 
      }), { status: 429 });
    }

    return new Response(JSON.stringify({ 
      error: "Analysis Failed", 
      details: error.message 
    }), { status: 500 });
  }
}
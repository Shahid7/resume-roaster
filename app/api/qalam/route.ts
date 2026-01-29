import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompts = {
      continue: `Continue the following text naturally. Give me only the next 10-15 words. Don't repeat what I wrote. Text: "${text}"`,
      deepen: `Rewrite this paragraph to be more descriptive and evocative. Keep the meaning but elevate the prose. Text: "${text}"`,
    };

    const result = await model.generateContent(prompts[mode as keyof typeof prompts]);
    const response = result.response.text().trim();
    
    return new Response(JSON.stringify({ suggestion: response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
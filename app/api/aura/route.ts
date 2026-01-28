import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { goal, energy } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      The user's goal is: "${goal}". Their energy level is: "${energy}".
      Act as a high-performance executive coach.
      
      Return ONLY a JSON object:
      {
        "strategyTitle": "A motivating title",
        "minimalist": {"task": "15-min task", "impact": "Why this matters"},
        "deepWork": {"task": "2-hour focused session", "impact": "The progress you'll make"},
        "extreme": {"task": "High-intensity challenge", "impact": "The breakthrough"},
        "quote": "A 5-word stoic reminder"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return new Response(text, { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
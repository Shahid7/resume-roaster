import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { energy } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate a 3-part Islamic "Deen Mission" for someone with ${energy} energy level. 
    Keep tasks very short and actionable.
    
    Return ONLY JSON:
    {
      "missionTitle": "Catchy Title",
      "tasks": [
        {"task": "Short action", "reward": "Benefit"},
        {"task": "Short action", "reward": "Benefit"},
        {"task": "Short action", "reward": "Benefit"}
      ],
      "boost": "5-word motivation"
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    return new Response(text, { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}
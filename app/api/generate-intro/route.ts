import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { jobTitle, company, skills } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We use the structured data we already saved in Day 8's database
    const prompt = `
      Task: Write a short, professional LinkedIn connection request.
      Context: I am applying for the ${jobTitle} role at ${company}.
      Requirement: Mention my interest/expertise in ${skills.join(", ")}.
      Tone: Human, concise (max 2 sentences), and not "salesy".
      
      Return ONLY the text of the message.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ intro: responseText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate" }), { status: 500 });
  }
}
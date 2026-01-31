import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { bio } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this user's bio/text and determine their "Digital Soul" profile.
      Text: "${bio}"

      Return ONLY JSON with these exact keys:
      1. primaryColor: (A Hex code representing their vibe: e.g., Emerald for growth, Electric Blue for logic, Crimson for chaos)
      2. secondaryColor: (A complementary hex code)
      3. pulseDuration: (Number between 1.5 and 5.0 - faster means more energetic/anxious)
      4. title: (A 2-word mystical title like "The Astral Architect" or "Vortex Voyager")
      5. description: (A 1-sentence poetic summary of their energy)
      6. antiTitle: (Their polar opposite title)
    `;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text().replace(/```json|```/g, ""));

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Soul Analysis Failed" }), { status: 500 });
  }
}
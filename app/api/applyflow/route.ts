import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { resume, jobDesc } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Act as a Senior Recruiter at a Fortune 500 company.      
      Resume: "${resume}"
      Job Description: "${jobDesc}"

      Analyze for:
      1. ATS Keyword Gap.
      2. Action-Verb strength.
      3. Predicted Interview Questions based on where the candidate is WEAKEST.

      Return ONLY a JSON object:
      {
        "matchScore": number (0-100),
        "missingKeywords": ["keyword1", "keyword2", ...],
        "strengths": ["point1", "point2"],
        "upgradedBullets": [
          {"original": "old bullet", "improved": "new bullet using job keywords and metrics"}
        ],
        "interviewPrep": [
            {
              "question": "The specific question they will ask",
              "why": "Why they are asking this based on your gaps",
              "tip": "How to answer this using the STAR method"
            }
          ],

        "verdict": "A 1-sentence summary of chances."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    return new Response(responseText, { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
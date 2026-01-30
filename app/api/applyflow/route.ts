import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '@/lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { resume, jobDesc } = await req.json();
    
    // Using 1.5-flash as it is the stable production model
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
        "matchScore": number,
        "missingKeywords": [],
        "strengths": [],
        "upgradedBullets": [{"original": "", "improved": ""}],
        "interviewPrep": [{"question": "", "why": "", "tip": ""}],
        "verdict": ""
      }
    `;

    const result = await model.generateContent(prompt);
    
    // 1. Get raw text and clean it
    const rawText = result.response.text().replace(/```json|```/g, "").trim();

    // 2. Parse the string into a JSON object
    const parsedData = JSON.parse(rawText);

    // 3. Log to Supabase Activity Feed
    // We use a try/catch here so if Supabase fails, the user still gets their result
    try {
      await supabase.from('lab_activity').insert({
        project_name: 'ApplyFlow',
        action_type: 'Resume Scanned',
        description: `Analysis complete with a ${parsedData.matchScore}% match.`
      });
    } catch (dbError) {
      console.error("Supabase Log Error:", dbError);
    }

    // 4. Return the parsed data to the frontend
    return new Response(JSON.stringify(parsedData), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
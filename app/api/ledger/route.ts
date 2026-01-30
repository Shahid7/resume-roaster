import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 2. Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { rawText, url } = await req.json();

    if (!rawText) {
      return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // The prompt is strictly formatted to ensure valid JSON output
    const prompt = `
  Analyze this job description and return ONLY a JSON object.
  
  CRITICAL INSTRUCTION FOR match_score:
  Compare the job text against this specific profile: [React, Next.js, TypeScript, Tailwind, AI API Integration].
  - If the job requires 4-5 of these: Score 85-100.
  - If the job requires 2-3 of these: Score 50-70.
  - If the job requires 0-1 of these: Score 10-30.
  Ensure match_score is a WHOLE NUMBER.

  Job Text: "${rawText.substring(0, 4000)}"

  JSON Format:
  {
    "company_name": "string",
    "job_title": "string",
    "salary_range": "string",
    "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
    "match_score": number,
    "culture_insight": "string"
  }
`;

    const result = await model.generateContent(prompt);
    // Find this line in your route.ts:
    let textOutput = result.response.text();

    // Replace the cleaning logic with this:
    const jsonMatch = textOutput.match(/\{[\s\S]*\}/); // Finds the first '{' and last '}'
    if (jsonMatch) {
    textOutput = jsonMatch[0];
    }

    const aiData = JSON.parse(textOutput);

    // 3. Final cleanup for the Database
    const finalData = {
      company_name: aiData.company_name || "Unknown",
      job_title: aiData.job_title || "Unknown Role",
      salary_range: aiData.salary_range || "N/A",
      top_skills: Array.isArray(aiData.top_skills) ? aiData.top_skills : [],
      match_score: Number(aiData.match_score) || 0, // Force numeric type
      culture_insight: aiData.culture_insight || "No specific culture data found.",
      url: url || ""
    };

    // 4. Save to Supabase
    const { data, error } = await supabase
      .from('job_leads')
      .insert([finalData])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data[0]), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
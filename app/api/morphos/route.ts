import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { bio } = await req.json();
    
    if (!bio) {
      return new Response(JSON.stringify({ error: "No bio provided" }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Analyze this text: "${bio.substring(0, 500)}"
      
      Return ONLY a raw JSON object with these keys:
      {
        "primaryColor": "A bright hex code",
        "secondaryColor": "A complementary hex code",
        "pulseDuration": number (1.5 to 5.0),
        "title": "2-word mystical title",
        "description": "1-sentence poetic summary",
        "antiTitle": "2-word brutal opposite name"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // 1. CLEANING: Remove potential Markdown code blocks (```json ... ```)
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    // 2. PARSING: Attempt to turn string into object
    const responseData = JSON.parse(cleanedText);

    return new Response(JSON.stringify(responseData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("MORPHOS_API_ERROR:", error);
    // Check if the error from Google is a 429
    if (error.status === 429 || error.message?.includes('429')) {
        return new Response(JSON.stringify({ 
          error: "RATE_LIMIT_EXCEEDED", 
          message: "The AI is exhausted. Please wait 60 seconds." 
        }), { status: 429 }); // Send 429 back to the frontend
      }
  
      // Otherwise, send a generic 500
    return new Response(JSON.stringify({ 
      error: "Synthesis Failed", 
      details: error.message 
    }), { status: 500 });
  }
}
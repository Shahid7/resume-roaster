import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json(); // image is a base64 string
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this image with the eyes of a philosopher and a minimalist.
      What do you see? What is the "vibe" or "energy" of this scene?
      
      Return ONLY a JSON object:
      {
        "objectDetected": "Main subject",
        "vibe": "One word vibe (e.g., Tranquil, Chaotic, Stagnant)",
        "insight": "A deep, 1-sentence philosophical observation about this image.",
        "action": "A small, mindful task the user should do right now based on this scene."
      }
    `;

    // Gemini Vision requires this specific format
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(",")[1], // Strip the data:image/jpeg;base64, part
          mimeType: mimeType
        },
      },
    ]);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    return new Response(text, { headers: { "Content-Type": "application/json" } });

} catch (error: any) {
    console.error("VISION_ERROR:", error);
    
    if (error.status === 503) {
      return new Response(JSON.stringify({ 
        error: "Server Overloaded", 
        message: "The AI is currently 'blinking.' Please wait 10 seconds and try the scan again." 
      }), { status: 503 });
    }
    
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
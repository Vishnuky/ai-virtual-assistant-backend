import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
You are not Google. You behave like a voice-enabled assistant.

STRICT INSTRUCTION:
- ONLY return a valid JSON object
- NO markdown
- NO explanation
- NO extra text

JSON format:
{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<processed input>",
  "response": "<short spoken reply>"
}

Rules:
- Keep response short and voice-friendly
- If asked who created you → say ${userName}
- If unsure → use "general"

User input: ${command}`;

    const result = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    let rawText = result.output_text?.trim() || "";

    // 🧹 Remove unwanted formatting if model adds it
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.warn("⚠ JSON parse failed. Raw output:", rawText);

      // 🛟 Fallback (prevents crash)
      parsed = {
        type: "general",
        userInput: command,
        response:
          rawText.slice(0, 120) || "Sorry, I couldn't understand that.",
      };
    }

    console.log("✅ Groq Response:", parsed);
    return parsed;

  } catch (error) {
    console.log(
      "❌ Groq API error:",
      error.response?.data?.error?.message || error.message
    );

    return {
      type: "general",
      userInput: command,
      response: "Sorry, I couldn't process that. Please try again.",
    };
  }
};

export default geminiResponse;
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.0-flash";

/**
 * Generates a new coding challenge
 */
const generateChallenge = async () => {
  const prompt = `Generate a coding challenge for a "Hacker/Cyberpunk" themed platform.
Return ONLY valid JSON with:
title, problemStatement, difficulty, points, category, testCases`;

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = res.text;
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    return null;
  }
};

/**
 * Validates submission
 */
const validateSubmission = async (challenge, lang, code) => {
  if (!code || code.trim().length < 5) {
    return { isCorrect: false, feedback: "CODE_TOO_SMALL" };
  }

  const prompt = `
Challenge: ${challenge.title}
${challenge.problemStatement}

Language: ${lang}
Code:
${code}

Return ONLY JSON:
{
  "isCorrect": boolean,
  "feedback": "short",
  "executionTimeEstimate": number,
  "memoryUsageEstimate": number
}`;

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return JSON.parse(res.text);
  } catch (err) {
    console.error("Gemini Validation Error:", err);
    return { isCorrect: false, feedback: "AI_FAILURE" };
  }
};

/**
 * Chat
 */
const chatWithGemini = async (prompt) => {
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return res.text || "No response";
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    throw err;
  }
};

module.exports = { generateChallenge, validateSubmission, chatWithGemini };
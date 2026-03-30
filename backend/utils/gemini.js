const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Generates a new coding challenge for the day.
 */
const generateChallenge = async () => {
  const prompt = `Generate a coding challenge for a "Hacker/Cyberpunk" themed platform.
  Return a JSON object with:
  - title: A cool hacker-style title.
  - problemStatement: Clear description of the problem.
  - difficulty: "Easy", "Medium", or "Hard".
  - points: Integer (50-200).
  - category: "DSA", "Backend", or "Frontend".
  - testCases: Array of objects with { input, output }.
  
  Format: 
  {
    "title": "...",
    "problemStatement": "...",
    "difficulty": "...",
    "points": 100,
    "category": "...",
    "testCases": [{"input": "...", "output": "..."}]
  }
  Output ONLY the JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON from potential markdown backticks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};

/**
 * Validates a code submission.
 */
const validateSubmission = async (challenge, lang, code) => {
  if (!code || code.trim().length < 5) {
    return { isCorrect: false, feedback: "CODE_FRAGMENT_TOO_SMALL: Minimum 5 characters required." };
  }

  const prompt = `You are a cold, efficient Hacker-AI code judge. 
  Challenge: ${challenge.title}
  Statement: ${challenge.problemStatement}
  Language: ${lang}
  User Code:
  ${code}
  
  Evaluate if this code correctly solves the problem. 
  Check for edge cases and logic.
  Output ONLY a JSON object:
  {
    "isCorrect": boolean,
    "feedback": "short technical feedback (hacker style)",
    "executionTimeEstimate": integer (ms),
    "memoryUsageEstimate": integer (KB)
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return { isCorrect: false, feedback: "NEURAL_LINK_STABILITY_ERROR: Evaluation failed." };
  }
};

/**
 * Handles a conversation with Gemini.
 */
const chatWithGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || "No response received.";
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    throw error;
  }
};

module.exports = { generateChallenge, validateSubmission, chatWithGemini };

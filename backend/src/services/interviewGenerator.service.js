import { extractJSON } from "../lib/extractJSON.js";
import { ai } from "../lib/llm.js";

export async function generateInterviewQA(resumeText, role) {
  const prompt = `
Generate 1 interview question with detailed answers based on this resume.

Resume:
${resumeText}

Target Role: ${role}

IMPORTANT: Return ONLY a valid JSON object with no additional text, code blocks, or formatting. Your response must be pure JSON that can be directly parsed.

Format JSON:
  { "question": "", "answer": "", "difficulty": "easy|medium|hard" }
`;

  const response = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return extractJSON(response.choices[0].message.content);
}

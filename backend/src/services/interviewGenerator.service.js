import { extractJSON } from "../lib/extractJSON.js";
import { ai } from "../lib/llm.js";
import { generateInterviewPrompt } from "../prompts/promts.js";

export async function generateInterviewQA(resumeText, role) {
  const prompt = generateInterviewPrompt(resumeText, role);

  const response = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return extractJSON(response.choices[0].message.content);
}

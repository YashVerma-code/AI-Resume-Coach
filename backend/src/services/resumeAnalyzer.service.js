import { extractJSON } from "../lib/extractJSON.js";
import { ai } from "../lib/llm.js";
import { resumeAnalyserPrompt } from "../prompts/promts.js";

export async function analyzeResume(rawText, role) {
  const prompt = resumeAnalyserPrompt(rawText, role);

  const response = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });
  return extractJSON(response.choices[0].message.content);
}

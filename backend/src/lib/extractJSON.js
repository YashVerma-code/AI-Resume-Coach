export const extractJSON=(text)=> {
  // Remove markdown code fences
  text = text.trim();

  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }

  return JSON.parse(text);
}

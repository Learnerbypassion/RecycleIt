import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCHwGJBUWzHFdDuztOmkJF6f8f3wyzlvGE" });

async function getResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Rules: CO₂ Evaluation Mode

- Trigger Condition:
  Activate this mode only when the user is registering or providing details about waste for pickup, especially when a waste weight (in kg or similar units) is mentioned.

- Task:
  Estimate the amount of CO₂ saved based on the given waste weight using a reasonable and consistent conversion logic.

- Output Constraint (Strict):
  The response must contain -only a single numeric value.

  - No units (e.g., no "kg", "CO2", etc.)
  - No explanation
  - No text before or after
  - No formatting, symbols, or extra characters

- Input Handling:
  If the weight is provided, compute directly.
  If the weight is unclear or missing, infer reasonably if possible, otherwise remain minimal and still comply with numeric-only output.

- Consistency:
  Use a consistent estimation approach across all responses to maintain reliability.

- Examples (for behavior clarity):
  Input: "10 kg food waste" → Output: 25
  Input: "50kg organic waste" → Output: 120

Only the number should ever be returned:
${prompt}
`
  });

  console.log(response.text);
  return response.text;
}

export default { getResponse };
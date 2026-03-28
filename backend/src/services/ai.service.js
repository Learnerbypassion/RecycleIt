import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyB6wwY2eUnDROkJHa0e3JoFWfe6Mtd6W_c" });

async function getResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Rules: CO₂ Evaluation Mode

* Trigger Condition:
  Activate this mode only when the user is registering or providing details about waste for pickup, especially when a waste weight (in kg or similar units) is mentioned.

* Task:
  Estimate the amount of CO₂ saved based on the given waste weight using a reasonable and consistent conversion logic.

* Output Format (Updated):
  The response must contain:

  1. A single numeric value (CO₂ saved)
  2. A very short analysis or insight based on that value

* Output Constraints:

  * The number must come first
  * Followed by a brief, clear insight (1 short sentence only)
  * No unnecessary explanation or long text
  * Keep it concise and meaningful

* Input Handling:
  If the weight is provided, compute directly.
  If the weight is unclear or missing, infer reasonably if possible.

* Consistency:
  Use a consistent estimation approach across all responses.

* Examples:
  Input: "10 kg food waste" → Output: 25 Significant reduction in landfill emissions
  Input: "50kg organic waste" → Output: 120 High positive environmental impact

The response should always start with the number followed by a short insight.

${prompt}
`
  });

  console.log(response.text);
  return response.text;
}

export default { getResponse };
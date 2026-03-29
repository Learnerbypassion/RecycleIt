import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: "AIzaSyBJEgT33Qpgt8W5uGRGfPVHmpexetBMmPs" });
async function getResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Rules: CO₂ Evaluation Mode

* Trigger Condition:
  Activate this mode only when the user is registering or providing details about waste for pickup, especially when a waste weight (in kg or similar units) is mentioned.

* Task:
  Estimate the amount of CO₂ saved based on the given waste weight using a reasonable and consistent conversion logic.

*and analysing the image you should give a 1 line analysis by analysing the image care fully
*and keep it brief and you can start like "You know you've   saved ...."
*you may write what are the adverse effects if they are not taken away
*and how it helps the naturte and controll the pollution

The response should always start with the number followed by a short insight.

${prompt}
`
  });

  console.log(response.text);
  return response.text;
}

async function analyzeWasteImage(base64ImageStr) {
  try {
    const base64Data = base64ImageStr.replace(/^data:image\/\w+;base64,/, "");
    const prompt = `You are a waste categorization AI.
Identify the primary waste material in this image.
You MUST output EXACTLY and ONLY valid JSON matching this schema:
{
  "type": "organic" | "plastic" | "metal" | "glass" | "paper" | "electronic" | "hazardous" | "other",
  "quantity": number
}
Example: {"type": "plastic", "quantity": 1.5}
Do not use markdown code blocks. Just output raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw error;
  }
}

export default { getResponse, analyzeWasteImage };
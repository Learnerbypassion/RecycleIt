import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDRWFIjF2mJnPvNi4IsEv5cwVWjdczWD7Q" });

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
*and keep it brief and you can start like "You know you've saved ...."
*you may write what are the adverse effects if they are not taken away
*and how it helps the naturte and controll the pollution

The response should always start with the number followed by a short insight.

${prompt}
`
  });

  console.log(response.text);
  return response.text;
}

export default { getResponse };
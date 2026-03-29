import aiService from "../services/ai.service.js";

const getAnalysis = async (req, res) => {
  try {
    const { weight, type } = req.body;
    
    if (!type) {
      return res.status(400).json({ message: "Waste type is required" });
    }

    const prompt = `
${weight || 0} kg ${type} waste
`;

    const result = await aiService.getResponse(prompt);

    return res.json({
      co2Saved: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating analysis" });
  }
};

const analyzeImageController = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const resultText = await aiService.analyzeWasteImage(image);
    
    const match = resultText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Invalid response format from Vision AI");
    }
    
    const parsed = JSON.parse(match[0]);
    return res.json(parsed);
  } catch (error) {
    console.error("AI Image Controller Error:", error);
    res.status(500).json({ message: "Error analyzing image" });
  }
};

export default { getAnalysis, analyzeImageController };
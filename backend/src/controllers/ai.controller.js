import Pickup from "../models/pickup.model.js";
import aiService from "../services/ai.service.js";

const getAnalysis = async (req, res) => {
  try {
    const { pickupId } = req.params;
    console.log(pickupId);
    
    const pickup = await Pickup.findById(pickupId).populate("waste");
    console.log(pickup);
    
    if (!pickup || !pickup.waste) {
      return res.status(404).json({ message: "Pickup or waste not found" });
    }
    const weight = pickup.waste.quantity || 0;
    const type = pickup.waste.type;
    const prompt = `
${weight} kg ${type} waste
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

export default { getAnalysis };
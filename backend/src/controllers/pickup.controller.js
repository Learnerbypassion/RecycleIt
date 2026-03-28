import Pickup from "../models/pickup.model.js";
import Waste from "../models/waste.model.js";
import Collector from "../models/collector.model.js";
import emailService from "../services/email.service.js";

const createPickup = async (req, res) => {
  try {
    const { collectorId, wasteId } = req.body;

    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ message: "Collector not found" });
    }

    if (!collector.acceptedTypes.includes(waste.type)) {
      return res.status(400).json({
        message: "Collector does not accept this waste type",
      });
    }

    const pickup = new Pickup({
      collector: collectorId,
      waste: wasteId,
      status: "accepted",
    });

    await pickup.save();

    // Update waste
    waste.status = "assigned";
    waste.collector = collectorId;
    await waste.save();

    // Send email safely
    try {
      await emailService.sendWasteFoundEmail(
        collector.email,
        collector.name,
        {
          type: waste.type,
          description: waste.description,
          status: waste.status,
          town: waste.town,
          area: waste.area,
          landmark: waste.landmark,
          mapLink: waste.mapLink,
          image: waste.image,
          name: waste.name || "N/A",
          phone: waste.phone || "N/A",
          email: waste.email || "N/A",
        }
      );
    } catch (error) {
      console.log("Email error:", error.message);
    }

    res.status(201).json({
      message: "Pickup created and waste assigned",
      pickup,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["accepted", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }
    if (pickup.status === "completed") {
      return res.status(400).json({ message: "Already completed" });
    }
    pickup.status = status;
    if (status === "completed") {
      await Waste.findByIdAndUpdate(pickup.waste, {
        status: "cleared",
      });
    }
    if (status === "cancelled") {
      await Waste.findByIdAndUpdate(pickup.waste, {
        status: "reported",
        collector: null,
      });
    }

    await pickup.save();

    res.json({
      message: "Pickup updated",
      pickup,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate("collector")
      .populate("waste");

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPickupById = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate("collector")
      .populate("waste");

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    res.json(pickup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createPickup,
  updatePickupStatus,
  getAllPickups,
  getPickupById,
};
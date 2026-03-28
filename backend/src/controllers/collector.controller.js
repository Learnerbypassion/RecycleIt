import Collector from "../models/collector.model.js";
import Waste from "../models/waste.model.js";

const getAllCollectors = async (req, res) => {
  try {
    const collectors = await Collector.find();

    res.status(200).json({
      count: collectors.length,
      data: collectors,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching collectors",
      error: error.message,
    });
  }
};

const joinAsCollector = async (req, res) => {
  try {
    const {
      name,
      email,
      type,
      acceptedTypes,
      location,
      contact
    } = req.body;

    if (
      !name ||
      !email ||
      !type ||
      !acceptedTypes ||
      !Array.isArray(acceptedTypes) ||
      !location?.town ||
      !location?.area
    ) {
      return res.status(400).json({
        message: "Please fill all required fields correctly",
      });
    }

    const existingCollector = await Collector.findOne({ email });
    if (existingCollector) {
      return res.status(400).json({
        message: "Collector already exists with this email",
      });
    }

    const normalizedTypes = acceptedTypes.map(t => t.toLowerCase());

    const newCollector = new Collector({
      name,
      email,
      type,
      acceptedTypes: normalizedTypes,
      location: {
        town: location.town,
        area: location.area,
      },
      contact,
    });

    await newCollector.save();

    res.status(201).json({
      message: "Collector added successfully",
      data: newCollector,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding collector",
      error: error.message,
    });
  }
};

const acceptThePickUp = async ()=>{
    const {collectorId, wasteId} = req.body
    const collector = await Collector.findById(collectorId)
    if(!collector){
        return res.status(400).json({
            message: "you are not a registerd collector",
            success: false
        })
    }
    const waste = await Waste.findById(wasteId)
    if(!waste){
        return res.status(400).json({
            message:"No waste pickup request is here"
        })
    }
    

}

export default {
  getAllCollectors,
  joinAsCollector,
  acceptThePickUp
};
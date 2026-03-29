import Waste from "../models/waste.model.js";
import Collector from "../models/collector.model.js";
import { uploadProfilePic } from "../services/stoorage.service.js";

const addWaste = async (req, res) => {
  try {
    console.log("1");
    
    const {
      name,
      phone,
      email,
      type,
      description,
      quantity,
      town,
      area,
      landmark,
      mapLink,
      image,
      force
    } = req.body;

    if (!name || !phone || !type || !town || !area) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const matchedCollectors = await Collector.find({
      acceptedTypes: { $in: [(type || "").toLowerCase()] },
      "location.town": { $regex: new RegExp(`^\\s*${town}\\s*$`, 'i') },
      "location.area": { $regex: new RegExp(`^\\s*${area}\\s*$`, 'i') },
    });
    


    let processedImage = image;
    if (image && image.startsWith("data:image")) {
      try {
        const base64Data = image.split(";base64,")[1];
        const uploadResult = await uploadProfilePic(base64Data);
        processedImage = uploadResult.url;
      } catch (err) {
        console.warn("ImageKit upload failed:", err.message);
        processedImage = ""; // Default empty if upload fails
      }
    }

    const waste = await Waste.create({
      name,
      phone,
      email,
      type,
      description,
      quantity,
      town,
      area,
      landmark,
      mapLink,
      image: processedImage,
    });

    res.status(201).json({
      message: "Complaint registered successfully",
      data: waste,
      matchedCollectors,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllWaste = async (req, res) => {
  try {
    const wastes = await Waste.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: wastes.length,
      data: wastes,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};

const getWasteById = async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);

    if (!waste) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const { type, town, area } = waste;

    const matchedCollectors = await Collector.find({
      acceptedTypes: { $in: [(type || "").toLowerCase()] },
      "location.town": { $regex: new RegExp(`^\\s*${town}\\s*$`, 'i') },
      "location.area": { $regex: new RegExp(`^\\s*${area}\\s*$`, 'i') },
    });

    res.status(200).json({
      data: waste,
      matchedCollectors,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaint",
      error: error.message,
    });
  }
};

const updateWasteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedWaste = await Waste.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedWaste) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedWaste,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};

const getWasteByUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const wastes = await Waste.find({ email }).sort({ createdAt: -1 });
    res.status(200).json({ data: wastes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user waste", error: error.message });
  }
};

export default {
  addWaste,
  getAllWaste,
  getWasteById,
  updateWasteStatus,
  getWasteByUser,
};
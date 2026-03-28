import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "plastic",// food waste
        "organic",// crop waste
        "metal",//garden waste
        "glass",//plastic waste
        "electronic",// Electronic waste
        "hazardous",// Glass waste
        "paper",// Hazardous waste
        "other"//Metal waste
        // cattle waste
      ],
    },
    
    // add one more feature about the purity of waste, whether it is pure, contaminated, mixed
    description: {
      type: String,
    },

    town: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    mapLink: {
      type: String,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["reported", "assigned", "cleared"], // pending, assinged, completed
      default: "reported",
    },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);

export default Waste;
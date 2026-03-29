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
        "plastic",
        "organic",
        "metal",
        "glass",
        "electronic",
        "hazardous",
        "paper",
        "Metal waste"
      ],
    },
    
    description: {
      type: String,
    },
    quantity:{
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

    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      default: null,
    },

    status: {
      type: String,
      enum: ["reported", "assigned", "cleared"],
      default: "reported",
    },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);

export default Waste;
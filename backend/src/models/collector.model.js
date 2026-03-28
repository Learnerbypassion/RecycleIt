import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    acceptedTypes: {
      type: [String],
      required: true,
    },

    location: {
      town: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
    },

    contact: {
      type: String,
    },
  },
  { timestamps: true }
);

const Collector = mongoose.model("Collector", collectorSchema);

export default Collector;
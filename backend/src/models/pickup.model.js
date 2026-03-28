import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      required: true,
    },
    waste:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Waste",
        required:true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Pickup = mongoose.model("Pickup", pickupSchema);

export default Pickup;
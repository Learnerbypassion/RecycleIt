import express from "express";
import pickupController from "../controllers/pickup.controller.js";

const router = express.Router();
router.post("/create", pickupController.createPickup);
router.get("/", pickupController.getAllPickups);
router.get("/:id", pickupController.getPickupById);
router.put("/:id/status", pickupController.updatePickupStatus);

export default router;  
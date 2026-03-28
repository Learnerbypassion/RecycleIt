import express from "express"
import aiController from "../controllers/ai.controller.js";

const router = express.Router();

router.post('/response', aiController.getAnalysis)

export default router
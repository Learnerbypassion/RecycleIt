import express from "express"
import aiController from "../controllers/ai.controller.js";

const router = express.Router();

router.post('/generate', aiController.getAnalysis)
router.post('/analyze-image', aiController.analyzeImageController)

export default router
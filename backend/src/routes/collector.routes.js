import express from "express"
import collectorController from "../controllers/collector.controller.js";

const router = express.Router();

router.get('/', collectorController.getAllCollectors);
router.post('/join', collectorController.joinAsCollector)

export default router
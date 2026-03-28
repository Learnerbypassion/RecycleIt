import express from "express";
import wasteController from "../controllers/waste.controller.js";


const router = express.Router()

router.post('/add', wasteController.addWaste );
router.get('/all', wasteController.getAllWaste);
router.get('/:id', wasteController.getWasteById);
router.put('/:id', wasteController.updateWasteStatus)

export default router;
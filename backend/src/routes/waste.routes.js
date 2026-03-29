import express from "express";
import wasteController from "../controllers/waste.controller.js";
import multer from "multer";

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/add', wasteController.addWaste );
router.get('/all', wasteController.getAllWaste);
router.put('/:wasteId/uplaod-image', upload.single("image"), wasteController.uploadImageController)
router.get('/user/:email', wasteController.getWasteByUser);
router.get('/:id', wasteController.getWasteById);
router.put('/:id', wasteController.updateWasteStatus);

export default router;
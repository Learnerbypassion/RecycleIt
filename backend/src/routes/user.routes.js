import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/join', userController.joinAsUser);

export default router;

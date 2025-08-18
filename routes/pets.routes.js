import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authOptionalMiddleware } from "../middlewares/authOptional.middleware.js";
import { petController } from "../controllers/pet.controller.js";
import { Router } from "express";
import fileUpload from 'express-fileupload';

const router = Router()

router.get("/", authOptionalMiddleware, petController.read);
router.get("/myPets", authMiddleware, petController.readByUser)
router.get("/:id", authOptionalMiddleware, petController.readById)
router.post("/", authMiddleware, fileUpload({useTempFiles : true, tempFileDir : './uploads/'}), petController.create)
router.patch('/:id', authMiddleware, petController.update);
router.delete("/:id", authMiddleware, petController.remove)

export default router;
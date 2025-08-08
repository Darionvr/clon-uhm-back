import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authOptionalMiddleware } from "../middlewares/authOptional.middleware.js";
import { petController } from "../controllers/pet.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";


const router = Router()

//obtener todas las mascotas  
router.get("/", authOptionalMiddleware, petController.read);

//Obtener por medio del usuario
router.get("/myPets", authMiddleware, petController.readByUser)

//Obtener mascotas por ID
router.get("/:id", authOptionalMiddleware, petController.readById)

//Crear una mascota
router.post("/", authMiddleware,  upload.single('photo'), petController.create)

//actualizar mascotas   
router.patch('/:id', authMiddleware, petController.update);

//eliminar mascotas
router.delete("/:id", authMiddleware, petController.remove)

export default router;
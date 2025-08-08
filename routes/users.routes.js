import { userController } from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { Router } from "express";
import fileUpload from 'express-fileupload';


const userRouter = Router();

userRouter.get("/me", authMiddleware, userController.getProfile)

//registra el usuario
userRouter.post("/register",  fileUpload({useTempFiles : true, tempFileDir : './uploads/'}), userController.register);

//login usuario

userRouter.post("/login", userController.login);


//actualizar el usuario
userRouter.patch("/me",authMiddleware, userController.update);


export default userRouter;
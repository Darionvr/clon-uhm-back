import { userController } from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { Router } from "express";
import fileUpload from 'express-fileupload';

const userRouter = Router();

userRouter.get("/me", authMiddleware, userController.getProfile)
userRouter.post("/register",  fileUpload({useTempFiles : true, tempFileDir : './uploads/'}), userController.register);
userRouter.post("/login", userController.login);
userRouter.patch("/me",authMiddleware, userController.update);

export default userRouter;
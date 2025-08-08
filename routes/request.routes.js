import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requestController } from '../controllers/request.controller.js';

const router = Router()


router.get("/", authMiddleware, requestController.findRequest);

router.post("/", authMiddleware, requestController.createRequest)

router.patch("/:id", authMiddleware, requestController.updateStatus)

router.delete('/:id', authMiddleware, requestController.deleteRequest);



export default router;
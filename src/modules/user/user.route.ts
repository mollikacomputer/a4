import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post('/register', userController.registerUser);
router.get('/allusers', userController.getAllUser);


export const userRouter = router;
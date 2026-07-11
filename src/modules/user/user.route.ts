import { Router } from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";


const router = Router();

router.post('/register', userController.registerUser);
router.get('/allusers', auth(UserRole.ADMIN) ,userController.getAllUser);


export const userRouter = router;
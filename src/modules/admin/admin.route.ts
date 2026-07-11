import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers);
router.post('/categories', adminController.createCategory);
router.get('/categories', adminController.getAllCategories);



router.patch('/users/:userId', auth(UserRole.ADMIN), adminController.updateUserStatus);

export const adminRoutes = router;
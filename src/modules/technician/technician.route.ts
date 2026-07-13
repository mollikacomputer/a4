import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();

// router.post("/refresh-token", authController.refreshToken);


router.put('/profile', auth(UserRole.ADMIN, UserRole.TECHNICIAN), technicianController.updateTecProfile);
router.get('/',auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN), technicianController.getProfile)


export const technicianRouter = router;
import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
router.post('/', auth(UserRole.ADMIN, UserRole.TECHNICIAN), serviceController.createService);
export const serviceRoute = router;
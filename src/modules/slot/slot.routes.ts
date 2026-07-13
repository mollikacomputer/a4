import { Router } from "express";
import { slotController } from "./slot.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post('/',auth(UserRole.ADMIN, UserRole.TECHNICIAN), slotController.createSlot)

export const slotRouter = router;
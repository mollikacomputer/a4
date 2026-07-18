import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post('/checkout', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN), paymentController.createCheckoutSession)
router.post('/webhook', paymentController.handleWebhook)

export const paymentRouter = router;
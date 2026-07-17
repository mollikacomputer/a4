import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router()


router.post(
  "/:bookingId",
  auth(UserRole.CUSTOMER),
  reviewController.createReview
);

router.patch('/:reviewId', auth(UserRole.CUSTOMER), reviewController.updateReview);
export const reviewRouter = router;

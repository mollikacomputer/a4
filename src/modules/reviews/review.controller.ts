import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.services";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;
    const bookingId = req.params.bookingId as string;
    const { rating, comment } = req.body;

    if (!bookingId) {
      throw new Error("Booking id is required");
    }

    const result = await reviewService.createReviewIntoDb({
      bookingId,
      customerId,
      rating,
      comment,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Customer review created successfully",
      data: result,
    });
  }
);

const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { reviewId } = req.params;
  const result = await reviewService.updateReviewIntoDB(reviewId as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
 updateReview
};

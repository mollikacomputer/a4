import { prisma } from "../../lib/prisma"
import { CreateReviewPayload } from "./review.interface";

const createReviewIntoDb = async(payload: CreateReviewPayload)=>{
    const { bookingId, customerId, rating, comment } = payload;

  if (!bookingId) {
    throw new Error("Booking id is required");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review a completed booking");
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this booking");
  }

  const result = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating,
      comment,
    },
  });

  return result;
}

export const reviewService = {
    createReviewIntoDb
}
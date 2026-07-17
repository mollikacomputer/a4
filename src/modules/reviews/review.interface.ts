
export type CreateReviewPayload = {
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
};

export type UpdateReview = {
  rating: number;
  comment?: string;
};
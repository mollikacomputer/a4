
export type CreateReviewPayload = {
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
};
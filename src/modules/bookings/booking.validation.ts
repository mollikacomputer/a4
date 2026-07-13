import { BookingStatus } from "../../../generated/prisma/enums";


const createBookingZodSchema = z.object({
  body: z.object({
    customerId: z.string({
      required_error: 'Customer id is required',
    }),
    technicianId: z.string({
      required_error: 'Technician id is required',
    }),
    serviceId: z.string({
      required_error: 'Service id is required',
    }),
    slotId: z.string().optional(),
    bookingDate: z.string({
      required_error: 'Booking date is required',
    }),
    status: z.nativeEnum(BookingStatus).optional(),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    technicianId: z.string().optional(),
    serviceId: z.string().optional(),
    slotId: z.string().nullable().optional(),
    bookingDate: z.string().optional(),
    status: z.nativeEnum(BookingStatus).optional(),
  }),
});

const updateBookingStatusZodSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus, {
      required_error: 'Status is required',
    }),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
  updateBookingStatusZodSchema,
};
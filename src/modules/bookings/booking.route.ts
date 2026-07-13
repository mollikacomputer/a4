import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.createBooking
);

router.get(
  '/',
 auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.getAllBookings
);

router.get(
  '/:id',
 auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.getSingleBooking
);

router.patch(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.updateBooking
);

router.patch(
  '/:id/status',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.updateBookingStatus
);

router.delete(
  '/:id',
 auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  BookingController.deleteBooking
);

export const BookingRoutes = router;
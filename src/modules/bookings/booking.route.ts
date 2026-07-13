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

export const bookingRoutes = router;
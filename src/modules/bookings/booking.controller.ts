
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';

import { sendResponse } from '../../utils/sendResponse';
import { Booking} from '../../../generated/prisma/client';
import { bookingService } from './booking.services';


const createBooking = catchAsync(async (req: Request, res: Response) => {
 
 const result = await bookingService.createBooking(req.body);

  sendResponse<Booking>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});


export const BookingController = {
  createBooking,
};
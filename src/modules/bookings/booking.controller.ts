import { NextFunction, Request, Response } from "express";
import { Booking } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.services";
import  httpStatus  from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id; // auth middleware থেকে আসবে
  const result = await bookingService.createBooking(customerId as string, req.body);

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


// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { catchAsync } from '../../utils/catchAsync';

// import { sendResponse } from '../../utils/sendResponse';
// import { Booking} from '../../../generated/prisma/client';
// import { bookingService } from './booking.services';


// const createBooking = catchAsync(async (req: Request, res: Response) => {
 
//  const result = await bookingService.createBooking(req.body);

//   sendResponse<Booking>(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Booking created successfully',
//     data: result,
//   });
// });


// export const BookingController = {
//   createBooking,
// };
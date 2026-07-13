import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { slotService } from "./slot.service";
import httpStatus from "http-status";

const createSlot = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;  // ✅ এটা ঠিক আছে কিনা চেক করুন
  const payload = req.body;


  const result = await slotService.createSlot(userId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Slot created successfully",
    data: result,
  });
});

const getAvailableSlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
 
  const result = await slotService.getAvailableSlots(query);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Available slots retrieved successfully",
    data: result,
  });
});

export const slotController = {
  createSlot,
  getAvailableSlots
};
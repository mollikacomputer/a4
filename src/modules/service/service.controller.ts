import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { serviceServices } from "./service.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus  from "http-status";


const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    // technicianId: req.user?.id, // অথবা req.user.technicianProfileId
  };

  const result = await serviceServices.createServiceFromDb(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service created successfully",
    data: result,
  });
});

export const serviceController ={
    createService,
}
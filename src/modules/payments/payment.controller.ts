import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus  from "http-status";
import { paymentService } from "./payment.service";


const createCheckoutSession = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.id;
    const result = await paymentService.createCheckoutSession(userId as string);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Checkout seassion created successfully",
        data: result,
    })


});

export const paymentController ={
    createCheckoutSession
}
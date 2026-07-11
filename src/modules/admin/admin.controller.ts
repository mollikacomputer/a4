import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from "http-status";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{

    const result = await adminService.getAllUsersFromDB()

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"All Users Shown successfully",
        data:result
    })
})

export const adminController ={
    getAllUsers,
}
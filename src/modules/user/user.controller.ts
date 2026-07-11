import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync( async( req: Request, res:Response, next: NextFunction )=>{
    const payload= req.body;
    const result = await userService.registerUserIntoDb(payload)

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User Register successfully",
        data:{
            result
            }
    });
})

const getAllUser = catchAsync( async(req:Request, res: Response, next:NextFunction)=>{
    const result = await userService.getAllUsersFromDb();

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"All user showen successfully",
        data:{
            result
        }
    })
})

export const userController = {
    registerUser,
    getAllUser
}
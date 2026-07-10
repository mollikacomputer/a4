import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import httpStatus from 'http-status';
const registerUser = catchAsync( async( req: Request, res:Response, next: NextFunction )=>{
    const payload= req.body;
    const user = await userService.registerUserIntoDb(payload)

    res.status(httpStatus.CREATED).json({
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User register successfully",
        data:{
            user
        }
    });
})


export const userController = {
    registerUser,
}
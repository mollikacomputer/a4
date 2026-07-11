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
});

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const result = await adminService.createCategoryIntoDb(payload)
    
    console.log("controller result =======:", result)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Created Category successfully",
        data: result,
    });
});

const getAllCategories = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result = await adminService.getCategoriesFronDb()

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.OK,
        message: ` Shown all categories successfully`,
        data: result
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authorId = req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";
  const userId = req.params.userId;

  if (!userId) {
    throw new Error("User Id Required In Params");
  }

  const payload = req.body;
  const result = await adminService.updateUserStatus(
    userId as string,
    authorId as string,
    isAdmin,
    payload.status
  );

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const adminController ={
    getAllUsers,
    createCategory,
    getAllCategories,
    updateUserStatus
}
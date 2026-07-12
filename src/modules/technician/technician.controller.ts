import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { NextFunction } from "express-serve-static-core";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";



const getProfile = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

  const result = await technicianService.getTechnicians();

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Technician profile is shown successfully",
        data: result
    })
});

const updateTecProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const userId = req.user?.id as string;
    const payload = req.body;
    
    const updatedProfile = await technicianService.updateTechnicianProfile(userId, payload)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Technician profile successfully update",
        data:{updatedProfile}
    })
})


export const technicianController = {
    getProfile,
    updateTecProfile,

}

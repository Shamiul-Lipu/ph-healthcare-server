import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialitiesServices } from "./specialities.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialitiesServices.insertIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Specialities Added Successfully",
    data: result,
  });
});

export const SpecialitiesControllers = {
  insertIntoDB,
};

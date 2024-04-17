import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.updateDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Updated Successfully!",
    data: result,
  });
});

export const DoctorControllers = {
  updateDoctor,
};

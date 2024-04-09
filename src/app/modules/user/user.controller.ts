import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Admin created successfuly",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Somthing went wrong",
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
};

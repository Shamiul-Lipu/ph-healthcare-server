import { Request } from "express";
import { fileUploader } from "../../../helper/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";

const insertIntoDB = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinay = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinay?.secure_url;
  }

  const result = await prisma.speciality.create({
    data: req.body,
  });

  return result;
};

export const SpecialitiesServices = {
  insertIntoDB,
};

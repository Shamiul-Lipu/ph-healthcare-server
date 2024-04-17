import express, { NextFunction, Request, Response } from "express";
import { SpecialitiesControllers } from "./specialities.controller";
import { fileUploader } from "../../../helper/fileUploader";
import { specialitesValidation } from "./specialites.validation";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialitesValidation.create.parse(JSON.parse(req.body.data));
    return SpecialitiesControllers.insertIntoDB(req, res, next);
  }
);

export const SpecialitiesRoutes = router;

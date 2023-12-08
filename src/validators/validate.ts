import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedError: string[] = [];

  errors.array().map((singleError) => {
    return extractedError.push(singleError.msg);
  });
  throw new ApiError(400, "Invalid data", extractedError);
};

export default validate;

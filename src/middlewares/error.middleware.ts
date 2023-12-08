import { NextFunction, Request, Response, Errback } from "express";
import ApiError from "../utils/ApiError.js";
import dotenv from "dotenv";
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  //checking if error is come from api error or not

  //If error is not an api error then we have to created new error

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, "Something went wrong");
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
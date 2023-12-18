import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
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
    console.log(err);
    error = new ApiError(
      err.statusCode ? err.statusCode : 500,
      err.message ? err.message : "Something went wrong"
    );
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;

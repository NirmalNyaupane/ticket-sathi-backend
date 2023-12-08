import dotenv from "dotenv";
dotenv.config();

class ApiError extends Error {
  statusCode: number;
  error: [] | string[];
  stack?: string | undefined;
  constructor(
    statusCode: number,
    message: string,
    error: string[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

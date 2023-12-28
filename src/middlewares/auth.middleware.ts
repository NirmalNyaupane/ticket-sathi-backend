import ApiError from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Role } from "../types/enum.js";
dotenv.config();

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decodeToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    );

    const user = await UserModel.findByPk(decodeToken.sub as string, {
      attributes: [
        "id",
        "full_name",
        "email",
        "phone_number",
        "avatar",
        "role",
        "address",
        "is_verified",
        "createdAt",
        "updatedAt",
        "is_organizer_registered"
      ],
    });
    if (!user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    req.user = {
      ...user.dataValues,
      address: user.address as string | undefined,
    };
    next();
  } catch (err) {
    next(new ApiError(401, "Unauthorized"));
  }
};

const verifyPermission = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return next(new ApiError(401, "Unauthorized"));
    }
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      return next(new ApiError(403, "forbiden resource"));
    }
  };
};

export { verifyJwt, verifyPermission };

import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const checkShopRegistered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check if shop is registered or not
  const isShopCreated = await UserModel.findByPk(req.user?.id, {
    attributes: ["is_organizer_registered"],
  });
  console.log(isShopCreated);
  if (isShopCreated?.dataValues.is_organizer_registered) {
    return next(new ApiError(400, "Shop is already created"));
  }
  next();
};

export default checkShopRegistered;

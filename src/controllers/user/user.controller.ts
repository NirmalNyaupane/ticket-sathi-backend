import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { ifElseObj } from "../../utils/helper.js";

const getCurrentUser = async (req: Request, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "fetch current user sucessfully"));
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, phone_number, address, old_password, new_password } =
      req.body;

    /* if old_password is come in response we have to check whether old_password is correct or not */
    if (old_password) {
      if (!new_password)
        return next(
          new ApiError(400, "Bad request", ["new_password is required"])
        );

      //check if old_password matched or not
      const user = await UserModel.findByPk(req.user?.id, {
        attributes: ["password"],
      });

      const isPasswordCorrect = await bcrypt.compare(
        old_password,
        user?.password || ""
      );
      if (!isPasswordCorrect)
        return next(new ApiError(400, "Bad request", ["logo is required"]));
    }

    //if avatar is present in request
    const avatarLocalPath: string = req.files?.avatar[0].path;
    const avatarPath = await uploadOnClouldinary(avatarLocalPath);

    const obj = {
      ...ifElseObj(full_name, { full_name: full_name }),
      ...ifElseObj(phone_number, { phone_number: phone_number }),
      ...ifElseObj(avatarPath !== null, { avatar: avatarPath?.secure_url }),
      ...ifElseObj(address, { address: address }),
      ...ifElseObj(new_password, { password: new_password }),
    };

    const uploadResponse = await UserModel.update(obj, {
      where: { id: req.user?.id },
    });

    if (uploadResponse[0]) {
      const userData = await UserModel.findByPk(req.user?.id, {
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
        ],
      });
      res
        .status(200)
        .json(new ApiResponse(200, userData, "User update sucessfully"));
    } else {
      res.status(500).json(new ApiError(500, "Cannot update data"));
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Internal server error"));
  }
};

export { getCurrentUser, updateUser };

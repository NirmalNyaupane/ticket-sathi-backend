import { NextFunction, Response, Request } from "express";
import OrganizerModel from "../../models/organizer.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { OrganizerStatus } from "../../types/enum.js";

const registerOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logoLocalPath = req.files?.logo && req.files?.logo[0].path;

    if (!logoLocalPath) {
      return next(new ApiError(400, "logo is required"));
    }

    const logoPath = await uploadOnClouldinary(logoLocalPath);
    if (!logoPath) {
      return next(new ApiError(500, "cannot registerd organizer"));
    }

    const organizerFormatData = {
      ...req.body,
      userId: req.user?.id,
      logo: logoPath?.secure_url,
      status: OrganizerStatus.PENDING,
    };

    const response = await OrganizerModel.create(organizerFormatData);
    res
      .status(200)
      .json(new ApiResponse(201, response, "organizer registered"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

export { registerOrganizerController };

import { NextFunction, Response, Request } from "express";
import OrganizerModel from "../../models/organizer.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { OrganizerStatus } from "../../types/enum.js";
import UserModel from "../../models/user.model.js";
import { ifElseObj } from "../../utils/helper.js";
const registerOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {organizer_name, description, website, address, social_links} = req.body;
    const logoLocalPath = req.files?.logo && req.files?.logo[0].path;

    if (!logoLocalPath) {
      return next(new ApiError(400, "logo is required"));
    }

    const logoPath = await uploadOnClouldinary(logoLocalPath);
    if (!logoPath) {
      return next(new ApiError(500, "cannot registerd organizer"));
    }
    //update is_organizer_register
    const updateResponse = await UserModel.update(
      { is_organizer_registered: true },
      {
        where: {
          id: req.user?.id,
        },
      }
    );

    if (!updateResponse[0]) {
      return next(new ApiError(500, "Cannot create beacuse of internal error"));
    }

    const organizerFormatData = {
      organizer_name, 
      description, 
      website, 
      address, 
      social_links,
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

const getOrganizerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizer = await OrganizerModel.findOne({
      where: {
        userId: req.user?.id,
      },
    });

    if (!organizer) {
      next("You havenot registered as a organizer. Please registered organizer first");
    }

    return res.status(200).json(new ApiResponse(200, organizer));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const updateOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logoLocalPath = req.files?.logo && req.files?.logo[0].path;
    const logoPath = await uploadOnClouldinary(logoLocalPath);

    //update is_organizer_register
    const updateResponse = await UserModel.update(
      { is_organizer_registered: true },
      {
        where: {
          id: req.user?.id,
        },
      }
    );

    if (!updateResponse[0]) {
      return next(new ApiError(500, "Cannot create beacuse of internal error"));
    }

    const organizerFormatData = {
      ...req.body,
      userId: req.user?.id,
      ...ifElseObj(logoPath !== null, { logo: logoPath?.secure_url }),
      status: OrganizerStatus.PENDING,
    };

    const response = await OrganizerModel.update(organizerFormatData, {
      where: { userId: req.user?.id },
    });

    if (response[0]) {
      return res.status(200).json(new ApiResponse(200, "organizer updated"));
    }
    return res
      .status(500)
      .json(new ApiError(500, "Cannot update user beacuse of interal error"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

export {
  registerOrganizerController,
  getOrganizerProfile,
  updateOrganizerController,
};

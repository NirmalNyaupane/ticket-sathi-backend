import { NextFunction, Request, Response } from "express";
import { Attributes, Op } from "sequelize";
import OrganizerModel from "../../models/organizer.model.js";
import UserModel from "../../models/user.model.js";
import { OrganizerStatus, Role } from "../../types/enum.js";
import { QueryType } from "../../types/queryType.typs.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import PaginateResponse from "../../utils/PaginateResponse.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { ifElseObj } from "../../utils/helper.js";
import pageAndLimit from "../../utils/pageAndlimit.js";
const registerOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizer_name, description, website, address, social_links } =
      req.body;
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

    const organizerFormatData: Attributes<OrganizerModel> = {
      organizer_name,
      description,
      website,
      address,
      social_links,
      userId: req.user?.id as string,
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
      next(
        "You havenot registered as a organizer. Please registered organizer first"
      );
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

const getAllOrganizerByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, limit, page, status } = req.query;
    const query: QueryType = pageAndLimit(Number(page), Number(limit));
    query.where = {
      ...ifElseObj(name !== undefined, {
        organizer_name: { [Op.iLike]: `%${name}%` },
      }),
      ...ifElseObj(req.user?.role !== Role.ADMIN, {
        status: OrganizerStatus.ACTIVE,
      }),
      ...ifElseObj(status !== undefined && req.user?.role === Role.ADMIN, {
        status: { [Op.eq]: status },
      }),
    };

    const organizers = await OrganizerModel.findAndCountAll({
      ...query,
    });
    const response = PaginateResponse(
      organizers.rows,
      organizers.count,
      +(limit || 0)
    );

    res.status(200).json(new ApiResponse(200, response));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal server error"));
  }
};

const changeOrganizerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    //check if organizer is exists or not
    const organizer = await OrganizerModel.findByPk(id);

    if (!organizer) {
      return next(
        new ApiError(400, "User with that id is not found", [
          "Invalid organizer id",
        ])
      );
    }
    const { status } = req.body;
    const updateStatus = await OrganizerModel.update(
      { status: status },
      { where: { id: id } }
    );

    if (updateStatus[0]) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "Organizer updated sucessfully"));
    }
    next(new ApiError(500, "Canot update organizer"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

export {
  changeOrganizerStatus,
  getAllOrganizerByAdmin,
  getOrganizerProfile,
  registerOrganizerController,
  updateOrganizerController,
};

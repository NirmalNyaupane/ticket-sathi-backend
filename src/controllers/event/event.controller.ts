import { NextFunction, Request, Response } from "express";
import { Attributes, Op } from "sequelize";
import EventModel from "../../models/event.model.js";
import EventCategoryModel from "../../models/eventcategory.model.js";
import OrganizerModel from "../../models/organizer.model.js";
import UserModel from "../../models/user.model.js";
import { error } from "../../theme/chalk.theme.js";
import { EventStatus, Role } from "../../types/enum.js";
import { QueryType } from "../../types/queryType.typs.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import PaginateResponse from "../../utils/PaginateResponse.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { ifElseObj } from "../../utils/helper.js";
import pageAndLimit from "../../utils/pageAndlimit.js";
const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      name,
      description,
      event_start_date,
      event_end_date,
      venue,
      event_category_id,
      address,
    } = req.body;
    //checking if categoryId is present or not
    const eventCategory = await EventCategoryModel.findOne({
      where: { id: req.body.event_category_id },
      attributes: ["id"],
    });
    if (!eventCategory) {
      return next(
        new ApiError(400, "Category not found", [
          "Category with this event_category_id is not found",
        ])
      );
    }

    //checking images
    type File = typeof req.file;
    //@ts-ignore
    const images: File[] = req?.files?.images;

    if (!images) {
      return next(new ApiError(400, "images is required"));
    }

    const posterLocalUrl: string =
      req?.files?.poster_image[0] && req?.files?.poster_image[0].path;
    if (!posterLocalUrl) {
      return next(
        new ApiError(400, "Invalid data", ["poster_image is required"])
      );
    }
    const imagesUrl: string[] = [];

    for (let singleImage of images) {
      const url = await uploadOnClouldinary(singleImage?.path as string);
      if (!url) {
        next(new ApiError(500, "Cannot upload images"));
        break;
      }

      imagesUrl.push(url.secure_url);
    }

    const posterUrl = await uploadOnClouldinary(posterLocalUrl);
    if (!posterUrl) {
      return next(new ApiError(500, "Cannot upload poster_image"));
    }

    const sendData: Omit<Attributes<EventModel>, "id" | "status"> = {
      name: name,
      type: type,
      description: description,
      event_start_date: event_start_date,
      event_end_date: event_end_date,
      images: imagesUrl,
      poster: posterUrl.secure_url,
      venue: venue,
      event_category_id: event_category_id,
      address: address,
    };
    const response = await EventModel.create(sendData);
    return res
      .status(201)
      .json(new ApiResponse(201, response, "Event sucessfully created"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const searchQuery = req.query.search as string;
    const status = req.query.status;

    const param = {
      ...ifElseObj(page !== undefined, { page: Number(page) }),
      ...ifElseObj(limit !== undefined, { limit: Number(limit) }),
      ...ifElseObj(searchQuery !== undefined, {
        search: searchQuery?.toLowerCase(),
      }),
      ...ifElseObj(status !== undefined, { status: status }),
    };

    const event = await EventModel.findAll({
      // ...ifElseObj(Object.keys(param).length > 0, { where: param }),
      attributes: [
        "id",
        "name",
        "type",
        "description",
        "event_start_date",
        "event_end_date",
        "images",
        "poster",
        "venue",
        "event_category_id",
        "status",
        "address",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          attributes: [],
          model: EventCategoryModel,
          required: true,
          include: [
            {
              attributes: [],
              model: OrganizerModel,
              required: true,

              include: [
                {
                  attributes: [],
                  model: UserModel,
                  required: true,

                  where: {
                    id: req.user?.id,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    return res.status(200).json(new ApiResponse(200, event));
  } catch (err) {
    console.log(error(err));
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    //check if event is exits or not
    const event = await EventModel.findByPk(id);

    if (!event) {
      return next(new ApiError(400, "event with that given id is not found"));
    }

    //perform delete
    const deleteEvent = await EventModel.destroy({ where: { id: id } });
    if (deleteEvent === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "event delete sucessfully"));
    }
    next(new ApiError(500, "problem occurs when deleting event"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    //check if event is exits or not
    const event = await EventModel.findByPk(id);

    //if event is not found
    if (!event) {
      return next(new ApiError(400, "event with that id is not found"));
    }

    //check if event category find or not
    const eventCategory = await EventCategoryModel.findOne({
      where: { id: req.body.id },
    });
    if (!eventCategory) {
      return next(new ApiError(400, "event_category not found"));
    }

    type File = typeof req.file;

    const posterImageLocalUrl: File = req.file?.poster_image;
    const posterImageUrl = await uploadOnClouldinary(
      posterImageLocalUrl?.path as string
    );

    const updateEvent = await EventModel.update(
      {
        ...req.body,
        poster: posterImageUrl?.secure_url,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updateEvent[0]) {
      const result = await EventModel.findByPk(id);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "event update sucessfully"));
    } else {
      return next(new ApiError(500, "Problem occurs while updating event"));
    }
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const getAllEventByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, name, status } = req.query;
    const query: QueryType = pageAndLimit(Number(page), Number(limit));
    const role = req.user?.role;

    //query
    query.where = {
      ...ifElseObj(name !== undefined, {
        name: { [Op.iLike]: `%${name}%` },
      }),
      ...ifElseObj(role !== Role.ADMIN, { status: EventStatus.PUBLISHED }),
      ...ifElseObj(status !== undefined, { status: { [Op.eq]: status } }),
    };
    
    const event = await EventModel.findAndCountAll({ ...query });
    const response = PaginateResponse(event.rows, event.count);
    return res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal Server Error"));
  }
};

const getAllPublishedEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, name } = req.query;
    const query: QueryType = pageAndLimit(Number(page), Number(limit));

    query.where = {
      ...ifElseObj(name !== undefined, {
        organizer_name: { [Op.iLike]: `%${name}%` },
      }),
      status: EventStatus.PUBLISHED,
    };
    const event = await EventModel.findAndCountAll({ ...query });
    const response = PaginateResponse(event.rows, event.count);
    return res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal Server Error"));
  }
};

export { createEvent, deleteEvent, getAllEventByAdmin, getEvent, updateEvent };


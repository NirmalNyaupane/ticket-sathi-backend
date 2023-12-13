import e, { NextFunction, Request, Response } from "express";
import OrganizerModel from "../../models/organizer.model.js";
import EventCategoryModel from "../../models/eventcategory.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

const createEventCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerUserId = req.user?.id;

    //get organizer id
    const organizerId = await OrganizerModel.findOne({
      where: { userId: organizerUserId },
      attributes: ["id"],
    });

    if (!organizerId) {
      return next(
        new ApiError(500, "Cannot create due to some internal issue")
      );
    }

    //check if name is already present or not
    const eventCategory = await EventCategoryModel.findOne({
      where: {
        organizer_id: organizerId.id,
        category_name: req.body.category_name,
      },
      attributes: ["category_name"],
    });

    if (eventCategory) {
      return next(
        new ApiError(400, "bad request", ["category_name already exits"])
      );
    }

    const category = await EventCategoryModel.create({
      ...req.body,
      organizer_id: organizerId?.dataValues.id,
    });

    res.status(200).json(new ApiResponse(200, category, "Category created"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerUserId = req.user?.id;

    //get organizer id
    const organizerId = await OrganizerModel.findOne({
      where: { userId: organizerUserId },
      attributes: ["id"],
    });

    if (!organizerId) {
      return next(
        new ApiError(500, "Cannot create due to some internal issue")
      );
    }

    //check if name is already present or not
    const eventCategory = await EventCategoryModel.findAll({
      where: {
        organizer_id: organizerId.id,
      },
    });

    return res.status(200).json(new ApiResponse(200, eventCategory));
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Internal server error"));
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    //check if category is exist or not with this id
    const eventCategory = await EventCategoryModel.findByPk(id);

    if (!eventCategory) {
      return next(new ApiError(400, "category with this id doesnot exits"));
    }
    const updateResponse = await EventCategoryModel.update(req.body, {
      where: { id: id },
    });

    if (updateResponse[0] === null) {
      return next(new ApiError(500, "Internal server error"));
    }

    const updatedCategory = await EventCategoryModel.findByPk(id);
    return res
      .status(200)
      .json(new ApiResponse(200, updatedCategory, "Event category updated"));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal server error"));
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    //check if category is exist or not with this id
    const eventCategory = await EventCategoryModel.findByPk(id);

    if (!eventCategory) {
      return next(new ApiError(400, "category with this id doesnot exits"));
    }

    const deleteResponse = await EventCategoryModel.destroy({
      where: { id: id },
    });
    if (deleteResponse === 1) {
      return res.status(200).json({ message: "category deleted sucessfully" });
    } else {
      return next(new ApiError(500, "Internal server error"));
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

export { createEventCategory, getAllCategory, updateCategory, deleteCategory };

import { NextFunction, Request, Response } from "express";
import EventCategoryModel from "../../models/eventcategory.model.js";
import ApiError from "../../utils/ApiError.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    console.log(req.files);
    
    if (!images) {
      return next(new ApiError(400, "images is required"));
    }

    const posterLocalUrl:File = req?.files?.poster_image;
    if (!posterLocalUrl) {
      return next(new ApiError(400, "Invalid data", ["poster_image is required"]));
    }

    const imagesUrl: string[] = [];
    for (let singleImage of images) {
      const url = await uploadOnClouldinary(singleImage?.path as string);
      if (!url) {
        next(new ApiError(500, "Internal server error"));
        break;
      }

      imagesUrl.push(url.secure_url);
    }

    res.status(200).json(new ApiResponse(200, imagesUrl));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

export { createEvent };

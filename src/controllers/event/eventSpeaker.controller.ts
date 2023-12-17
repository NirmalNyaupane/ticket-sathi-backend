import { NextFunction, Request, Response } from "express";
import EventModel from "../../models/event.model.js";
import ApiError from "../../utils/ApiError.js";
import EventSpeakerModel from "../../models/eventSpeaker.model.js";
import { ifElseObj } from "../../utils/helper.js";
import { Attributes } from "sequelize";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

const eventSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { event_id, name, title, social_links } = req.body;

    //checks if event id exist or not
    const event = await EventModel.findOne({ where: { id: req.body.id } });

    if (!event) {
      return next(new ApiError(400, "event with that event_id not found"));
    }

    type File = typeof req.file;
    const avatarLocalUrl: File = req.files?.avatar;

    if (!avatarLocalUrl) {
      return next(new ApiError(400, "avatar is required"));
    }
    const avatarUrl = await uploadOnClouldinary(avatarLocalUrl.path);
    if (!avatarUrl) {
      return next(new ApiError(500, "cannot upload avatar"));
    }
    const formatData: Attributes<EventSpeakerModel> = {
      title: title,
      avatar: avatarUrl?.secure_url as string,
      ...ifElseObj(social_links !== "undefined", {
        social_links: social_links,
      }),
      name: name,
    };
    const eventSpeakerResponse = await EventSpeakerModel.create(formatData);
    res
      .status(200)
      .json(new ApiResponse(200, eventSpeakerResponse, "Sucessfully created"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500,"Internal server error"))
  }
};

export { eventSpeaker };

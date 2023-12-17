import { NextFunction, Request, Response } from "express";
import { Attributes } from "sequelize";
import EventModel from "../../models/event.model.js";
import EventSpeakerModel from "../../models/eventSpeaker.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import uploadOnClouldinary from "../../utils/clouldinary.service.js";
import { ifElseObj } from "../../utils/helper.js";

const eventSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { event_id, name, title, social_links } = req.body;

    //checks if event id exist or not
    const event = await EventModel.findByPk(req.body.event_id);

    if (!event) {
      return next(new ApiError(400, "event with that event_id not found"));
    }

    type File = typeof req.file;
    const avatarLocalUrl: File = req.file;

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
      event_id: event_id,
      name: name,
    };
    const eventSpeakerResponse = await EventSpeakerModel.create(formatData);
    res
      .status(200)
      .json(new ApiResponse(200, eventSpeakerResponse, "Sucessfully created"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const getEventSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    //checking if event exits or not
    const event = await EventModel.findByPk(id);
    if (!event) {
      return next(new ApiError(400, "Event with this event_id not found"));
    }

    const eventSpeakers = await EventSpeakerModel.findAll({
      include: [
        {
          attributes: [],
          model: EventModel,
          where: {
            id: id,
          },
        },
      ],
    });
    res.status(200).json(new ApiResponse(200, eventSpeakers));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const updateEventSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    //checking if event speaker exits or not with that id

    const eventSpeaker = await EventSpeakerModel.findByPk(id);

    if (!eventSpeaker) {
      return next(
        new ApiError(400, "Event Speaker with that id doesnot found")
      );
    }

    const avatarLocalUrl = req?.file;
    const avatarUrl = await uploadOnClouldinary(avatarLocalUrl?.path as string);

    const updateResponse = await EventSpeakerModel.update(
      {
        ...req.body,
        ...ifElseObj(avatarUrl !== null, {
          avatar: avatarUrl?.secure_url,
        }),
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updateResponse[0]) {
      const updatedResponse = await EventSpeakerModel.findByPk(id);
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedResponse,
            "event speaker updated sucessfully"
          )
        );
    } else {
      return next(new ApiError(500, "problem occurs during update"));
    }
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal server error"));
  }
};

const deleteEventSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const eventSpeaker = await EventSpeakerModel.findByPk(id);

    if (!eventSpeaker) {
      return next(
        new ApiError(400, "Event Speaker with that id doesnot found")
      );
    }

    const deleteResponse = await EventSpeakerModel.destroy({
      where: { id: id },
    });

    if (deleteResponse === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "Event speaker deleted sucessfully"));
    }

    return next(
      new ApiError(500, "Problem occurs during deleting event speaker")
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};
export {
  eventSpeaker,
  getEventSpeaker,
  updateEventSpeaker,
  deleteEventSpeaker,
};

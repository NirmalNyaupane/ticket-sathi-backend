import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError.js";
import EventModel from "../../models/event.model.js";
import { ifElseObj } from "../../utils/helper.js";
import ApiResponse from "../../utils/ApiResponse.js";
import TicketModel from "../../models/ticket.model.js";
import { Attributes, Op } from "sequelize";
import OrganizerModel from "../../models/organizer.model.js";
import EventCategoryModel from "../../models/eventcategory.model.js";
const createEventTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      event_id,
      number_of_tickets,
      name,
      max_per_person,
      tax,
      price,
      early_bird_offer,
      discount_type,
      discount,
      discount_end_date,
    } = req.body;

    //checking if event exits or not with that event id
    const event = await EventModel.findByPk(event_id);

    if (!event) {
      return next(new ApiError(500, "event with that id not found"));
    }

    //check if ticket with that name is created or not
    const ticket = await TicketModel.findOne({
      where: { name: name, event_id: event_id },
    });
    if (ticket) {
      return next(new ApiError(400, "ticket with that name is already exits"));
    }
    const formatedData: Attributes<TicketModel> = {
      event_id: event_id,
      number_of_tickets: number_of_tickets,
      name: name,
      ...ifElseObj(max_per_person !== "undefined", {
        max_per_person: max_per_person,
      }),
      tax: tax,
      price: price,
      early_bird_offer: early_bird_offer,
      ...ifElseObj(discount_type !== "undefined", {
        discount_type: discount_type,
      }),
      ...ifElseObj(discount !== "undefined", { discount: discount }),
      ...ifElseObj(discount_end_date !== "undefined", {
        discount_end_date: discount_end_date,
      }),
    };
    const response = await TicketModel.create(formatedData);
    res
      .status(200)
      .json(new ApiResponse(200, response, "ticket created sucessfully"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    //checking if ticket is exit or not
    const ticket = await TicketModel.findOne({ where: { id: id } });
    if (!ticket) {
      return next(new ApiError(400, "ticket with that id is not found"));
    }

    const formatData = {
      ...req.body,
      ...ifElseObj(!req.body.early_bird_offer, {
        discount_type: null,
        discount: null,
        discount_end_date: null,
      }),
    };
    const response = await TicketModel.update(formatData, {
      where: { id: id },
    });
    if (response[0]) {
      const result = await TicketModel.findByPk(id);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "sucessfuly updated"));
    }
    next(new ApiError(500, "Problem occurs while updating ticket"));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal server error"));
  }
};

const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    //check if ticket exits or not
    const ticket = await TicketModel.findByPk(id);
    if (!ticket) {
      return next(new ApiError(400, "ticket with this id is not found"));
    }

    //delete ticket
    const deleteTicket = await TicketModel.destroy({ where: { id: id } });

    if (deleteTicket === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "ticket delete sucessfully"));
    }

    return next(new ApiError(500, "problem occurs while deleting event"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};
export { createEventTicket, updateTicket, deleteTicket};

import { NextFunction, Request, Response } from "express";
import { Attributes } from "sequelize";
import CouponModel from "../../models/coupons.model.js";
import EventModel from "../../models/event.model.js";
import EventCategoryModel from "../../models/eventcategory.model.js";
import OrganizerModel from "../../models/organizer.model.js";
import UserModel from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
const createCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    event_id,
    tickets_ids,
    name,
    code,
    discount_type,
    discount,
    discount_end_date,
    number_of_coupons,
    is_active,
    min_amount,
  } = req.body;
  try {
    //checking if event_id exits or not
    const event = await EventModel.findByPk(event_id, { attributes: ["id"] });
    if (!event) {
      return next(new ApiError(400, "event with that event_id doesnot found"));
    }

    //checking if coupon exist or not
    const coupon = await CouponModel.findOne({
      where: { code: code.toUpperCase() },
      attributes: ["id"],
    });

    if (coupon) {
      return next(new ApiError(400, `${code} already exits`));
    }

    const formatData: Attributes<CouponModel> = {
      event_id: event_id,
      tickets_ids: tickets_ids,
      name: name,
      code: code,
      discount_type: discount_type,
      discount: discount,
      discount_end_date: discount_end_date,
      number_of_coupons: number_of_coupons,
      is_active: is_active,
      min_amount: min_amount,
    };

    const response = await CouponModel.create(formatData);
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Coupon created"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.id;

    const coupons = await CouponModel.findAll({
      include: [
        {
          attributes: ["id", "name"],
          model: EventModel,
          include: [
            {
              attributes: [],
              model: EventCategoryModel,
              include: [
                {
                  attributes: [],
                  model: OrganizerModel,
                  include: [
                    {
                      attributes: [],
                      model: UserModel,
                      where: {
                        id: id,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return res.status(200).json(new ApiResponse(200, coupons));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    //check if coupon exit or not
    const coupon = await CouponModel.findByPk(id);
    if (!coupon) {
      return next(new ApiError(400, "coupon with that id doesnot found"));
    }
    const deleteResponse = await CouponModel.destroy({ where: { id: id } });

    if (deleteResponse === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Coupon delete sucessfully"));
    }
    return next(new ApiError(500, "Problem occurs while deleting an event"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    //checking if event exits or not with that id
    const coupon = await CouponModel.findByPk(id);

    if (!coupon) {
      return next(new ApiError(400, "Coupon with that id doesnot found"));
    }

    const updateResponse = await CouponModel.update(req.body, {
      where: { id: id },
    });

    if (updateResponse[0]) {
      const updatedResponse = await CouponModel.findByPk(id);
      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedResponse, "Coupon updated sucessfully")
        );
    } else {
      return next(new ApiError(500, "Problem occurs while updating"));
    }
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};
export { createCouponController, deleteCoupon, getAllCoupons, updateCoupon};

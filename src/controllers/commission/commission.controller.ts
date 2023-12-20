import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError.js";
import CommissionModel from "../../models/commission.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { QueryType } from "../../types/queryType.typs.js";
import pageAndLimit from "../../utils/pageAndlimit.js";
import PaginateResponse from "../../utils/PaginateResponse.js";

const commissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, percentage, organizer_ids, status } = req.body;
    const commission = await CommissionModel.create({
      name: name,
      percentage: percentage,
      organizer_ids: organizer_ids,
      status: status,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, commission, "commission created sucessfully"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal Server Error"));
  }
};

const getCommissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;
    const query: QueryType = pageAndLimit(Number(page), Number(limit));

    const commission = await CommissionModel.findAndCountAll({ ...query });
    const response = PaginateResponse(commission.rows, commission.count);

    res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Internal server error"));
  }
};

export { commissionController, getCommissionController };

import { Model } from "sequelize";

const PaginateResponse = (rows: Model[], count: number, limit = 0) => {
  return {
    totalCount: count,
    lastPage: Math.ceil(count / (limit !== undefined ? +limit : 1)),
    data: rows,
  };
};

export default PaginateResponse;

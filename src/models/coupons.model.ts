import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/index.js";
import { DiscountType } from "../types/enum.js";
import EventModel from "./event.model.js";
class CouponModel extends Model<InferAttributes<CouponModel>, InferCreationAttributes<CouponModel>> {
    declare id?:string;
    declare event_id:string;
    declare tickets_id:Array<string>;
    declare name:string;
    declare code:string;
    declare discount_type:DiscountType;
    declare discount:number;
    declare discount_end_date:Date;
    declare number_of_coupons:Date;
    declare is_active:boolean;
    declare min_amount:number
}

CouponModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tickets_id: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM(DiscountType.FLAT, DiscountType.PERCENTAGE),
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    number_of_coupons: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    min_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Coupons",
  }
);

CouponModel.belongsTo(EventModel, {
  foreignKey: "event_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

EventModel.hasMany(EventModel, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
});

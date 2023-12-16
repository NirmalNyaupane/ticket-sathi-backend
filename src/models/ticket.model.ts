import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/index.js";
import { DiscountType } from "../types/enum.js";
import EventModel from "./event.model.js";
class TicketModel extends Model<
  InferAttributes<TicketModel>,
  InferCreationAttributes<TicketModel>
> {
  declare id?: string;
  declare event_id: string;
  declare number_of_tickets: number;
  declare name: string;
  declare max_per_person?: number;
  declare tax: number;
  declare price: number;
  declare early_bird_offer: boolean;
  declare discount_type?: DiscountType;
  declare discount?: number;
  declare discount_end_date?: Date;
}
TicketModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    number_of_tickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_per_person: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    early_bird_offer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    discount_type: {
      type: DataTypes.ENUM(DiscountType.FLAT, DiscountType.PERCENTAGE),
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discount_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Tickets",
  }
);

TicketModel.belongsTo(EventModel, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  targetKey: "id",
});

EventModel.hasOne(TicketModel, {
  onDelete: "CASCADE",
  foreignKey:"event_id",
  // foreignKeyConstraint:true
});

export default TicketModel;

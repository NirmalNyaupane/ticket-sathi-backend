import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/index.js";
import { Event, EventStatus } from "../types/enum.js";
import EventCategoryModel from "./eventcategory.model.js";
class EventModel extends Model<
  InferAttributes<EventModel>,
  InferCreationAttributes<EventModel>
> {
  declare id?: string;
  declare name: string;
  declare type: Event;
  declare description: string;
  declare event_start_date: Date;
  declare event_end_date: Date;
  declare images: Array<string>;
  declare poster: string;
  declare venue: string;
  declare event_category_id: string;
  declare status?: EventStatus;
  declare address: string;
}

EventModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(Event.CONCERT, Event.THEATER),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    event_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING), //clouldinary url,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(EventStatus.ACTIVE, EventStatus.PENDING),
      allowNull: false,
      defaultValue: EventStatus.PENDING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["name"],
      },
    ],
    sequelize,
    modelName: "Event",
  }
);
EventModel.belongsTo(EventCategoryModel, {
  onDelete: "CASCADE",
  foreignKey: "event_category_id",
  targetKey: "id",
});

EventCategoryModel.hasOne(EventModel, {
  onDelete: "CASCADE",
  foreignKey:"event_category_id",
  // foreignKeyConstraint:true
});
export default EventModel;

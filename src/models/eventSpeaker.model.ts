import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/index.js";
import EventModel from "./event.model.js";
class EventSpeakerModel extends Model<
  InferAttributes<EventSpeakerModel>,
  InferCreationAttributes<EventModel>
> {
  declare id?: string;
  declare event_id?: string;
  declare name: string;
  declare title: string;
  declare avatar: string;
  declare social_links?: Array<JSON>;
}

EventSpeakerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_links: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "EventSpeaker",
  }
);

EventSpeakerModel.belongsTo(EventModel, {
  foreignKey: "event_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

EventModel.hasOne(EventSpeakerModel, {
  onDelete: "CASCADE",
});

export default EventSpeakerModel;

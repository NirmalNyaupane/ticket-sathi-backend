import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { sequelize } from "../db/index.js";
import OrganizerModel from "./organizer.model.js";
class EventCategoryModel extends Model<
  InferAttributes<EventCategoryModel>,
  InferCreationAttributes<EventCategoryModel>
> {
  declare id: string;
  declare category_name: string;
  declare description: string;
  declare organizer_id: string;
}

EventCategoryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    organizer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["category_name"],
      },
    ],
    sequelize,
    tableName: "EventCategory",
  }
);
EventCategoryModel.belongsTo(OrganizerModel, {
  foreignKey: "organizer_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

export default EventCategoryModel;

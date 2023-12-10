import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../db/index.js";
import UserModel from "./user.model.js";
import { OrganizerStatus } from "../types/enum.js";
import EventCategoryModel from "./eventcategory.model.js";
class OrganizerModel extends Model<
  InferAttributes<OrganizerModel>,
  InferCreationAttributes<OrganizerModel>
> {
  declare id: string;
  declare userId: string;
  declare organizer_name: string;
  declare logo: string;
  declare description: string;
  declare website: string;
  declare address: string;
  declare social_links: Array<JSON>;
  declare status: OrganizerStatus;
}

OrganizerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organizer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING, //clouldinary url
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_links: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        OrganizerStatus.ACTIVE,
        OrganizerStatus.PENDING,
        OrganizerStatus.SUSPEND
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["organizer_name"],
      },
    ],
    modelName: "Organizer",
  }
);

OrganizerModel.belongsTo(UserModel, {
  foreignKey: "userId",
  targetKey: "id",
});
export default OrganizerModel;

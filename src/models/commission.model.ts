import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../db/index.js";
import { CommissionStatus } from "../types/enum.js";
class CommissionModel extends Model<
  InferAttributes<CommissionModel>,
  InferCreationAttributes<CommissionModel>
> {
  declare id?: string;
  declare name: string;
  declare percentage: number;
  declare status: CommissionStatus;
  declare organizer_ids:string[];
}

CommissionModel.init(
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
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    organizer_ids:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false
    },
    status: {
      type: DataTypes.ENUM(CommissionStatus.ACTIVE, CommissionStatus.INACTIVE),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Commission",
  }
);

export default CommissionModel;

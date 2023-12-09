import bcrypt from "bcrypt";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../db/index.js";
import UserModel from "./user.model.js";
class OtpModel extends Model<
  InferAttributes<OtpModel>,
  InferCreationAttributes<OtpModel>
> {
  declare email: string;
  declare otp: string;
  declare expiredAt: Date;

  //generate otp
  static generateOtp = (): number => {
    const otp = Math.floor(1000 + Math.random() * 99999);
    return otp;
  };

  //verify otp
  /**
   *
   * @param otp plane otp
   * @returns Promise<boolean>
   */
  verifyOtp = async (otp: string): Promise<boolean> => {
    return await bcrypt.compare(otp, this.otp);
  };
}

OtpModel.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      onDelete: "",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Otp",
    hooks: {
      beforeSave: async (user, options) => {
        user.otp = await bcrypt.hash(user.otp, 10);
      },
    },
  }
);
OtpModel.belongsTo(UserModel, {
  onDelete: "cascade",
  foreignKey: "email",
  targetKey: "email",
});
export default OtpModel;

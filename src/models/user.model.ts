import { sequelize } from "../db/index.js";

import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import bcrypt from "bcrypt";
import { Role } from "../types/user.enum.js";
import OtpModel from "./otp.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare password: string;
  declare id: string;
  declare full_name: string;
  declare email: string;
  declare phone_number: string;
  declare avatar: string;
  declare address: string | null;
  declare role: Role;
  declare is_verified: boolean;

  //this function verify the password of user
  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  //generate access token
  generateAccessToken() {
    return jwt.sign(
      {
        sub: this.id,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET || "ojojreoer",
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "/public/static/user.png",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(Role.USER, Role.SELLER),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeSave: async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

UserModel.hasOne(UserModel, { onDelete: "cascade" });

export default UserModel;

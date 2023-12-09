import { sequelize } from "../db/index.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Role } from "../types/user.enum.js";
import OrganizerModel from "./organizer.model.js";

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
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare is_organizer_registered?: boolean;
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
      type: DataTypes.UUID,
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
      type: DataTypes.ENUM(Role.USER, Role.ORGANIZER),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_organizer_registered: {
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
UserModel.hasOne(UserModel, { onDelete: "CASCADE" });
// UserModel.hasOne(OrganizerModel,{onDelete:"CASCADE"});

export default UserModel;

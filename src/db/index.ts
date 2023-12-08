import { Sequelize } from "sequelize";
import { error as showError } from "../theme/chalk.theme.js";

import dotenv from "dotenv";

const sequelize = new Sequelize(process.env.PG_URI || "", {
  dialect: "postgres",
});

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync(); //In production it should be removed
  } catch (error) {
    console.log(showError(error));
  }
};

dotenv.config();

export { connectDb, sequelize };

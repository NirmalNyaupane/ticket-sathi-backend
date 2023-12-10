import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { error as showError } from "../theme/chalk.theme.js";
import defineAssociation from "../models/index.js";

// deepcode ignore ServerLeak: <please specify a reason of ignoring this>
const sequelize = new Sequelize(process.env.PG_URI || "", {
  dialect: "postgres",
});

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); //In production it should be removed
  } catch (error) {
    console.log(showError(error));
  }
};

dotenv.config();

export { connectDb, sequelize };

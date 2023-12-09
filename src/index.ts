import dotenv from "dotenv";
import { httpServer } from "./app.js";
import { connectDb } from "./db/index.js";
import { sucess } from "./theme/chalk.theme.js";

dotenv.config();

const port = process.env.PORT || 8080;

const startServer = () => {
  httpServer.listen(port, () => {
        console.log(sucess(`Server is started at port ${port}`))
  });
};


startServer();
connectDb();

import dotenv from "dotenv";
import { httpServer } from "./app.js";
import { sucess, error, warning} from "./theme/chalk.theme.js";
import { connectDb } from "./db/index.js";

dotenv.config();

const port = process.env.PORT || 8080;

const startServer = () => {
  httpServer.listen(port, () => {
        console.log(sucess(`Server is started at port ${port}`))
  });
};


startServer();
connectDb();

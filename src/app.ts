import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import errorHandler from "./middlewares/error.middleware.js";
import { fileURLToPath } from "url";
import yaml from "yaml";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import cookieParsel from "cookie-parser";
import path from "path";
import Tokens from "csrf";
dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const file = fs.readFileSync(
  path.resolve(__dirName, "./swagger.yaml"),
  "utf-8"
);
const swaggerDocument = yaml.parse(file);

const app = express();
const httpServer = http.createServer(app);

/********************** global middlewares ****************************/
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParsel());
app.use(express.static("public")); //Static configure for locally stored file

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

app.use(limiter);
app.use(helmet());

// app.use(csrf());
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none",
      defaultOpen: true,
    },
    customSiteTitle: "NeCommerce",
  })
);

// app.use("/*", (req, res, next) => {
//   return next(new ApiError(400, `Cannot ${req.method} ${req.url}`));
// });
/*************************** app route starts *******************************************/
import authRouter from "./routes/auth/auth.routes.js";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/auth/user.routes.js";
import organizerRouter from "./routes/organizer/organizer.routes.js";
import eventRouter from "./routes/event/event.routes.js";
import ticketRouter from "./routes/event/ticket.routes.js";
import couponRouter from "./routes/event/coupon.routes.js";
//auth router
app.use("/auth", authRouter);

//user router
app.use("/user", userRouter);

//organizer router
app.use("/organizer", organizerRouter);

//event router
app.use("/event", eventRouter);
app.use("/event-ticket", ticketRouter);
app.use("/coupons", couponRouter);
/**** global error handler *****/

app.use(errorHandler);

export { httpServer };

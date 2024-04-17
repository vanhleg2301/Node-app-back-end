import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import dotenv from "dotenv";
import connectDB from "./helpers/init_mongodb.js";
import { verifyAccessToken } from "./helpers/jwt_helper.js";
import cors from "cors";
import {
  userRouter,
  authRouter,
  blogRouter,
  folderRouter,
  noteRouter,
} from "./routes/indexRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 9999;

const app = express();
// Ghi log khi cos request call api
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Wildcard is NOT for Production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Router:
app.get("/", verifyAccessToken, async (req, res, next) => {
  //console.log(req.headers['authorization']);
  res.send("Hello from Express");
});

app.use("/auth", authRouter);
app.use("/users", verifyAccessToken, userRouter);
app.use("/blogs", verifyAccessToken, blogRouter);
app.use("/folders", verifyAccessToken, folderRouter);
app.use("/notes", verifyAccessToken, noteRouter);

// Chỉ định middleware kiểm soát requests không hợp lệ
app.use(async (req, res, next) => {
  next(createError.NotFound()); // Có thể bổ sung message trong hàm NotFound
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7rlyvdl.mongodb.net/`;

app.listen({ port: PORT }, () => {
  connectDB(URI);
  console.log(`Server running on port ${PORT}`);
});

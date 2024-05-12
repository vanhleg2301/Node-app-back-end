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
  imageRouter,
} from "./routes/indexRoutes.js";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";

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

const authorizationJWT = async (req, res, next) => {
  console.log({ authorization: req.headers.authorization });
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(" ")[1];

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        console.log({ decodedToken });
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        console.log({ err });
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
    next();
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Router:
app.use("/auth", authRouter);
app.use("/users", authorizationJWT, userRouter);
app.use("/folders", authorizationJWT, folderRouter);
app.use("/notes", noteRouter);

// public
app.use("/blogs", blogRouter);
app.use("/images", imageRouter);

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

const URI = `http://localhost:9999/`;
//`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7rlyvdl.mongodb.net/`;

app.listen({ port: PORT }, () => {
  connectDB(process.env.MONGO_URI);
  console.log(`Server running on port ${PORT}`);
});

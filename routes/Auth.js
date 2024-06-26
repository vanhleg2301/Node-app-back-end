import express from "express";
import createError from "http-errors";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  updateAccessToken,
  updateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";

const AuthRouter = express.Router();

AuthRouter.post("/loginWith", async (req, res, next) => {
  try {
    const userData = req.body;
    console.log("[From front-end]: ", userData);

    // Find the existing user by email
    // let existingUser = await User.findOne({ email: userData.email });
    let existingUser = await User.findOne({ uid: userData.uid });

    // If the user doesn't exist, create a new user
    if (!existingUser) {
      existingUser = new User(userData);
    } else {
      // Update the existing user data
      existingUser.set(userData);
    }

    // Save the user data
    await existingUser.save();

    // Send a success response
    res.status(200).json({ success: true, user: existingUser });
  } catch (error) {
    // Handle errors
    next(error);
  }
});

AuthRouter.post("/register", async (req, res, next) => {
  try {
    const {
      uid,
      email,
      password,
      displayName,
      photoURL,
      phoneNumber,
      accessToken,
      refreshToken,
      role = "user",
    } = req.body;

    if (!email || !password) throw createError.BadRequest();

    const emailExist = await User.findOne({ email: email });
    if (emailExist)
      throw createError.Conflict(`${email} is already been registered.`);

    const hashPass = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SECRET)
    );
    const savedUser = await User.create({
      uid,
      email,
      password: hashPass,
      displayName,
      photoURL,
      phoneNumber,
      accessToken,
      refreshToken,
      role,
    });

    // const accessToken = await signAccessToken(savedUser.id)
    // res.send({ accessToken });
    res.send(savedUser);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw createError.BadRequest(`Invalid Email/Password`);

    const existUser = await User.findOne({ email: email }).exec();
    if (!existUser) throw createError.NotFound("User not registered");

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) throw createError.Unauthorized("Email/Password not valid");

    const accessToken = await signAccessToken(existUser.id);

    const refreshToken = await signRefreshToken(existUser.id);

    updateAccessToken(email, accessToken);
    updateRefreshToken(email, refreshToken);
    await existUser.save();

    res.send({ accessToken, user: existUser });
    console.log({ existUser });
  } catch (error) {
    next(error);
  }
});

AuthRouter.delete("/logout", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.id;

    // Tìm người dùng dựa trên userId
    const user = await User.findById(userId);

    // Nếu không tìm thấy người dùng, trả về lỗi 404 (Not Found)
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Cập nhật refreshToken của người dùng thành null
    const usr = await User.findByIdAndUpdate(userId, { refreshToken: null });
    console.log(usr);

    // Trả về mã trạng thái 204 (No Content) để cho biết đăng xuất thành công
    res.sendStatus(204);
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

AuthRouter.post("/verify", verifyAccessToken, (req, res, next) => {
  res.sendStatus(200);
});

AuthRouter.post("/refresh-token", async (req, res, next) => {
  // res.send("Refresh-Token route");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    if (userId) {
      const accessToken = await signAccessToken(userId);
      const refreshToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refreshToken });
    }
  } catch (error) {
    next(error);
  }
});

export default AuthRouter;

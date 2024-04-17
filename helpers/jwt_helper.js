import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/User.js";
// import client from './int_redis.js';

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "3h",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        // reject(err)
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
      // ,
      // (err, payload) => {
      //   if (err) {
      //     const message =
      //       err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      //     return next(createError.Unauthorized(message));
      //   }
      //   req.payload = payload;
      //   next();
      // }
    );

    req.id = decoded.aud;
    console.log("userId: ", decoded.aud);
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
}

const updateRefreshToken = async (email, refreshToken) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { refreshToken: refreshToken },
      { new: true }
    );
    console.log("Refresh token updated successfully:", user);
    return user;
  } catch (error) {
    console.error("Error updating refresh token:", error);
    throw error;
  }
};

const updateAccessToken = async (email, accessToken) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { accessToken: accessToken },
      { new: true }
    );
    console.log("accessToken token updated successfully:", user);
    return user;
  } catch (error) {
    console.error("Error updating accessToken token:", error);
    throw error;
  }
};

function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }

      resolve(token);
    });
  });
}

function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.aud;
        // client.GET(userId, (err, result)=>{
        //     if(err){
        //         console.log(err.message);
        //         reject(createError.InternalServerError());
        //         return;
        //     }
        //     if(refreshToken === result)
        //         return resolve(userId);
        //     reject(createError.Unauthorized());
        // })
        return resolve(userId);
      }
    );
  });
}

export {
  signAccessToken,
  signRefreshToken,
  updateAccessToken,
  updateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

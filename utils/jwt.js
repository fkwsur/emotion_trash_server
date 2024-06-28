const jwt = require("jsonwebtoken");
const { cw_user } = require("../models");
const dotenv = require('dotenv');
dotenv.config();
const { ACCESS_KEY, REFRESH_KEY } = process.env;

module.exports = {
  createToken: (payload) => {
    const token = jwt.sign(
      {
        id: payload.toString()
      },
      ACCESS_KEY,
      {
        algorithm: "HS256",
        expiresIn: "30m",
      }
    );
    return token;
  },
  verifyToken: (token) => {
    if (!token) {
      return "";
    }
    let decoded = jwt.verify(token, ACCESS_KEY);
    return decoded;
  },
  checkToken: async (data) => {
    try {
      let check = await dao.findById(cw_user, data);
      return check;
    } catch (e) {}
  },
  createRefreshToken: (payload) => {
    const token = jwt.sign(
      {
        id: payload.toString(),
      },
      REFRESH_KEY,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      }
    );
    return token;
  },
  verifyRefreshToken: (token) => {
    if (!token) {
      return "";
    }
    let decoded = jwt.verify(token, REFRESH_KEY);
    return decoded;
  },
};

const jwt = require("jsonwebtoken");
const brcypt = require("bcryptjs");

const { environment } = require("../config");

const generateToken = (payload) => {
  return jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn: "1d",
  })
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, environment.JWT_SECRET);
  } catch (ex) {
    throw new Error(ex.message);
  }
};

const hashPassword = (password) => {
  return brcypt.hashSync(password, brcypt.genSaltSync(10));
};

const checkPassword = (password, hash) => {
  return brcypt.compareSync(password, hash);
};

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

module.exports = {
  generateToken,
  hashPassword,
  verifyToken,
  checkPassword,
  generateOtp,
};

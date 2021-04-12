const jwt = require("jsonwebtoken");
const constants = require("./../variables/constants");

const generateToken = (email, userRole) => {
  return jwt.sign({ email: email, role: userRole }, constants.TOKEN_SECRET, {
    expiresIn: 36000,
  });
};

module.exports = generateToken;

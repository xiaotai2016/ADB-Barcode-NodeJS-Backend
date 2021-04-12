const jwt = require("jsonwebtoken");
const constants = require("./../variables/constants");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  console.log("token");
  if (!token) return res.status(401).send("Access Denied");

  console.log(`token is received - ${token}`);
  try {
    const verified = jwt.verify(token, constants.TOKEN_SECRET);
    console.log(verified);
    req.useremail = verified.email;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

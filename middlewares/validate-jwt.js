const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Header does not have authorization" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "Token is required",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token is no valid",
      });
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "User state: false",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token is not valid",
    });
  }
};

module.exports = {
  validateJWT,
};

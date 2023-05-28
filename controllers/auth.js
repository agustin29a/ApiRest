const { response, request } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "email is not exist in database",
      });
    }

    if (!user.state) {
      return res.status(400).json({
        msg: "user inactive",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "password is incorrect",
      });
    }

    const token = await generateJWT(user.id);

    try {
      res.json({
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "You communicate with the it technician",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  login,
};

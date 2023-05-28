const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const userPost = async (req, res = response) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  userPost,
};

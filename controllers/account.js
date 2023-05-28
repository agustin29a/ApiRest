const { response } = require("express");
const Account = require("../models/account");

const accountPost = async (req, res = response) => {
  try {
    const { credit, currencyId } = req.body;

    if (credit < 0) {
      return res.status(400).json({
        msg: `credit incorrect`,
      });
    }
    userId = req.user._id;

    const account = new Account({ credit, currencyId, userId });

    await account.save();

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

const accountByUser = async (req, res = response) => {
  try {
    userId = req.user._id;
    const [accounts, count] = await Promise.all([
      Account.find({ userId })
        .populate("userId", "name")
        .populate("currencyId", "code"),
      Account.countDocuments({ userId }),
    ]);

    res.json({ accounts, count });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

const accountGetAll = async (req, res = response) => {
  try {
    const accounts = await Account.find()
      .select(["_id", "userId"])
      .populate("userId", "name");

    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  accountPost,
  accountByUser,
  accountGetAll,
};

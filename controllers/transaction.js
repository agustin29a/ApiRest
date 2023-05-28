const { response, request } = require("express");
const Transaction = require("../models/transaction");
const Account = require("../models/account");
const axios = require("axios");
const moment = require("moment");
const mongoose = require("mongoose");
const { stringToDate } = require("../helpers");

const transactionPost = async (req = request, res = response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { accountFrom, accountTo, description } = req.body;
    let { amount } = req.body;

    const userId = req.user._id;

    let commission = 0;

    const queryFrom = {
      _id: accountFrom,
      userId,
    };

    const accountUserFrom = await Account.findOne(queryFrom).populate(
      "currencyId",
      "code"
    );

    if (!accountUserFrom) {
      return res.status(400).json({
        msg: `accountFrom incorrect`,
      });
    }

    const queryTo = {
      _id: accountTo,
      userId,
    };

    let accountUserTo = await Account.findOne(queryTo).populate(
      "currencyId",
      "code"
    );

    if (!accountUserTo) {
      accountUserTo = await Account.findOne({ _id: accountTo }).populate(
        "currencyId",
        "code"
      );
      commission = amount * 0.01;
    }

    let total = amount + commission;

    if (accountUserFrom.credit < total) {
      return res.status(400).json({
        msg: `credit account is not sufficient`,
      });
    }

    if (accountUserFrom.currencyId.code !== accountUserTo.currencyId.code) {
      const base = accountUserFrom.currencyId.code;
      const symbols = accountUserTo.currencyId.code;

      const { data } = await axios.get(
        `https://api.apilayer.com/fixer/latest?base=${base}&symbols=${symbols}`,
        {
          headers: { apikey: process.env.APIKEY },
        }
      );

      const rate = parseFloat(Object.values(data.rates)[0]);

      amount = amount * rate;
      commission = commission * rate;
    }

    const date = moment().format();

    const transaction = new Transaction({
      userId,
      accountFrom,
      accountTo,
      date,
      description,
      amount,
      commission,
    });

    await Promise.all([
      transaction.save(),
      accountUserFrom.updateOne({ credit: accountUserFrom.credit - total }),
      accountUserTo.updateOne({ credit: accountUserTo.credit + amount }),
    ]);

    await session.commitTransaction();

    res.status(201).json({ transaction });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({ msg: "error" });
  }

  session.endSession();
};

const transactionGetByUser = async (req = request, res = response) => {
  try {
    let { From, To, SourceAccountID } = req.query;

    const userId = req.user._id;

    let query = {
      userId,
    };

    if (From !== undefined && From !== null) {
      const dateFrom = stringToDate(From);
      query = { ...query, date: { $gte: dateFrom } };
    }

    if (To !== undefined && To !== null) {
      const dateTo = stringToDate(To);
      query = { ...query, date: { ...query.date, $lt: dateTo } };
    }

    if (SourceAccountID !== undefined && SourceAccountID !== null) {
      query = { ...query, accountFrom: SourceAccountID };
    }

    const transaction = await Transaction.find(query);
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  transactionPost,
  transactionGetByUser,
};

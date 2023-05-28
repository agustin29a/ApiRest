const { response, request } = require("express");
const Currency = require("../models/currency");
const axios = require("axios");

const currencySeed = async (req, res = response) => {
  try {
    await Currency.deleteMany({});

    const { data } = await axios.get("https://api.apilayer.com/fixer/symbols", {
      headers: { apikey: process.env.APIKEY },
    });

    const symbols = data.symbols;
    const currencyInsert = [];

    Object.keys(symbols).forEach(async (key) => {
      currencyInsert.push({ code: key, description: symbols[key] });
    });

    await Currency.insertMany(currencyInsert);

    res.json({ msg: "sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error" });
  }
};

const currencyGetAll = async (req = request, res = response) => {
  try {
    const { limit = 200, from = 0 } = req.query;

    const [currencies, total] = await Promise.all([
      Currency.find().skip(Number(from)).limit(Number(limit)),
      Currency.countDocuments(),
    ]);

    res.json({ total, currencies });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  currencySeed,
  currencyGetAll,
};

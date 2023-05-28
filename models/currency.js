const { Schema, model } = require("mongoose");

const CurrencySchema = Schema({
  code: {
    type: String,
    required: [true, "code is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
});

CurrencySchema.methods.toJSON = function () {
  const { __v, _id, ...currency } = this.toObject();
  currency.uid = _id;
  return currency;
};

module.exports = model("Currency", CurrencySchema);

const { Schema, model } = require("mongoose");

const AccountSchema = Schema({
  credit: {
    type: Number,
    default: 0,
  },
  currencyId: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
});

AccountSchema.methods.toJSON = function () {
  const { __v, ...account } = this.toObject();
  return account;
};

module.exports = model("Account", AccountSchema);

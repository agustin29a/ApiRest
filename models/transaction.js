const { Schema, model } = require("mongoose");

const TransactionSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountFrom: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  accountTo: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "date is required"],
  },
  description: {
    type: String,
    required: [true, "name is required"],
  },
  amount: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Transaction", TransactionSchema);

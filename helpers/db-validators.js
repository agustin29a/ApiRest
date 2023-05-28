const { User, Currency, Account } = require("../models");

const emailExist = async (email = "") => {
  const emailRegistered = await User.findOne({ email });
  if (emailRegistered) {
    throw new Error(`email ${email} is already registered`);
  }
};

const existUserById = async (id) => {
  const existId = await User.findById(id);
  if (!existId) {
    throw new Error(`id ${id} is not exist`);
  }
};

const existCurrency = async (currencyId = "") => {
  const currency = await Currency.findById(currencyId);
  if (!currency) {
    throw new Error(`currency is not registred`);
  }
};

const existAccount = async (accountId = "") => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`account is not exist`);
  }
};

module.exports = {
  emailExist,
  existUserById,
  existCurrency,
  existAccount,
};

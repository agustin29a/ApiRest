const moment = require("moment");

const maskDate = "YYYY-MM-DD";

const stringToDate = (date) => {
  try {
    return moment(date, maskDate).toDate();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  stringToDate,
};

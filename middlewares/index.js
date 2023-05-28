const validateField = require("../middlewares/validate-field");
const validateJWT = require("../middlewares/validate-jwt");

module.exports = {
  ...validateField,
  ...validateJWT,
};

const { Router } = require("express");
const { check } = require("express-validator");
const {
  accountPost,
  accountByUser,
  accountGetAll,
} = require("../controllers/account");
const { validateField, validateJWT } = require("../middlewares");
const { existCurrency } = require("../helpers");

const router = Router();

router.post(
  "/",
  [
    validateJWT,
    check("currencyId", "currencyId is not valid").isMongoId(),
    check("currencyId").custom(existCurrency),
    validateField,
  ],
  accountPost
);

router.get("/user", validateJWT, accountByUser);

router.get("/", accountGetAll);

module.exports = router;

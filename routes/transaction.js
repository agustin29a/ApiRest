const { Router } = require("express");
const { check } = require("express-validator");
const {
  transactionPost,
  transactionGetByUser,
} = require("../controllers/transaction");
const { validateField, validateJWT } = require("../middlewares");
const { existAccount } = require("../helpers");

const router = Router();

router.post(
  "/transfer",
  [
    validateJWT,
    check("accountFrom", "accountFrom is not valid").isMongoId(),
    check("accountTo", "accountFrom is not valid").isMongoId(),
    check("accountFrom").custom(existAccount),
    check("accountTo").custom(existAccount),
    validateField,
  ],
  transactionPost
);

router.get("/transactions", validateJWT, transactionGetByUser);

module.exports = router;

const { Router } = require("express");
const { currencySeed, currencyGetAll } = require("../controllers/currency");

const router = Router();

router.get("/", currencyGetAll);

router.get("/seed", currencySeed);

module.exports = router;

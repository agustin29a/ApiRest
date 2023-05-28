const { Router } = require("express");
const { check } = require("express-validator");
const { userPost } = require("../controllers/user");
const { validateField } = require("../middlewares");
const { emailExist } = require("../helpers");

const router = Router();

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("password", "password is required, min 6 character").isLength({
      min: 6,
    }),
    check("email", "email is not valid").isEmail(),
    check("email").custom(emailExist),
    validateField,
  ],
  userPost
);

module.exports = router;

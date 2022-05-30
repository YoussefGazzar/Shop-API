const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");

router.post(
  "/signup",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter a valid password")
      .trim()
      .isLength({ min: 3 }),
    body("name", "Please enter a valid name").trim().notEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().notEmpty()],
  authController.updateUserStatus
);

module.exports = router;

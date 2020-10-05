const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// POST api/auth/signup
router.route("/signup").post(authController.signup);

// POST api/auth/login
router.route("/login").post(authController.login);

// POST api/auth/logout
router.route("/logout").delete(authController.logout);

// GET api/auth/me
router.route("/me").get(authController.me);

// Export our router, so that it can be imported to construct our apiRouter;
module.exports = router;

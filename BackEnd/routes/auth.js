const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");


// POST api/auth/login
router.route("/login").post(authController.login);

// POST api/auth/logout
router.route("/logout").delete(authController.logout);


// Export our router, so that it can be imported to construct our apiRouter;
module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

// GET api/users/
router.route("/").get(userController.getAllUsers);


// Export our router, so that it can be imported to construct our apiRouter;
module.exports = router;

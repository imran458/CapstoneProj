const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image");

// POST api/image/upload
router.route("/upload").post(imageController.upload);

// GET api/image/getImages
router.route("/getImages/:email").get(imageController.getImages)




// Export our router, so that it can be imported to construct our apiRouter;
module.exports = router;
const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image");

// POST api/image/upload
router.route("/upload").post(imageController.upload);

// GET api/image/getImages
router.route("/getImages").get(imageController.getImages);

// DELETE api/image/delete/<imagename>
router.route("/delete/:name").delete(imageController.deleteImage);

// POST api/image/likeImage
router.route("/updateImageLikes").post(imageController.updateImageLikes);

// GET api/image/getLikedImages
router.route("/getLikedImages").get(imageController.getLikedImages);




// Export our router, so that it can be imported to construct our apiRouter;
module.exports = router;
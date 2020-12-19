// Here, we can prepare to register our models, set up associations between tables, and generate a barrel file for the models;

const User = require("./user");
const Image = require("./image");
const UserLikedImages = require("./userLikedImages");

module.exports = {
	User,
	Image,
	UserLikedImages
};

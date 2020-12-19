const Sequelize = require("sequelize");
const db = require("../db");

const UserLikedImages = db.define("User Liked Images", {
	user: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.STRING,
		allowNull: false
	},
	
});


module.exports = UserLikedImages;
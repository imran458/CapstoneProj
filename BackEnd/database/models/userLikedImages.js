const Sequelize = require("sequelize");
const db = require("../db");

const UserLikedImages = db.define("User Liked Images", {
	user: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.INTEGER,
		references: {
			model: 'images',
			key: 'id'
		}
	},
	
});

module.exports = UserLikedImages;
const Sequelize = require("sequelize");
const db = require("../db");

const Image = db.define("image", {
	url: {
		type: Sequelize.STRING,
		allowNull: false
	},
	user: {
		type: Sequelize.STRING,
		allowNull: false
	},
	location: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
});


module.exports = Image;

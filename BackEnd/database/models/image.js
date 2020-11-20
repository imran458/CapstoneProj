const Sequelize = require("sequelize");
const db = require("../db");

const Image = db.define("image", {
	url: {
		type: Sequelize.STRING,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	user: {
		type: Sequelize.STRING,
		allowNull: false
	},
	latitude: {
		type: Sequelize.DECIMAL,
		unique: true,
		allowNull: false
	},
	longitude: {
		type: Sequelize.DECIMAL,
		unique: true,
		allowNull: false
	},
});


module.exports = Image;

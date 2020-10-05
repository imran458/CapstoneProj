const { User, Post } = require("../database/models");

const seedDatabase = async () => {
	try {
		await Promise.all([
			User.create({
				name: "Elijah Cano",
				email: "elijahcano@gmail.com",
			}),
			User.create({
				name: "Jordan Yaqoob",
				email: "jordan@gmail.com",
			})
		]);
	} catch (err) {
		console.log(err);
	}
};

module.exports = seedDatabase;

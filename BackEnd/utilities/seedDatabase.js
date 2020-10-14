const { User, Post } = require("../database/models");

const seedDatabase = async () => {
	try {
		await Promise.all([
			User.create({
				first: "Elijah",
				last: "Cano",
				email: "elijahcano@gmail.com",
			}),
			User.create({
				first: "Jordan",
				last: "Yaqoob",
				email: "jordan@gmail.com",
			})
		]);
	} catch (err) {
		console.log(err);
	}
};

module.exports = seedDatabase;

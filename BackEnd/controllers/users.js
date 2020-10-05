const { User } = require("../database/models");

const userController = {
	getAllUsers: getAllUsers,
	getUserById: getUserById
};

// GET api/users/
async function getAllUsers(req, res, next) {
	try {
		const users = await User.findAll();
		res.status(200).json(users);
		console.log("attempting to find users");
	} catch (err) {
		console.log(err);
	}
}

// GET api/users/:id
async function getUserById(req, res, next) {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			res.json(user);
		} else {
			res.status(404).send("User not found");
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = userController;

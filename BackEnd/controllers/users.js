const { User } = require("../database/models");
const jwt = require("jsonwebtoken");

const userController = {
	getAllUsers: getAllUsers,
};

// GET api/users/
async function getAllUsers(req, res, next) {
	try {
		if(authenticateToken(req)){
			console.log('attempting to find users');
			const users = await User.findAll();
			res.status(200).json(users);
		}
	} catch (err) {
		console.log(err);
	}
}

function authenticateToken(req) {
	// Gather the jwt access token from the request header
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	console.log(token);
  
	console.log(jwt.verify(token, 'token secret change me'))
	return false
}

module.exports = userController;

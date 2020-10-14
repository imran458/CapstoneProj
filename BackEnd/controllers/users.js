const { User } = require("../database/models");
const jwt = require("jsonwebtoken");

const userController = {
	getAllUsers: getAllUsers,
};

// GET api/users/
async function getAllUsers(req, res, next) {
	try {
		const auth = await authenticateToken(req);
		console.log(auth);
		if(auth === "Success"){
			console.log('attempting to find users');
			const users = await User.findAll();
			res.status(200).json(users);
		} else{
			res.status(403).send(auth)
		}
	} catch (err) {
		console.log(err);
	}
}

async function authenticateToken(req) {
	// Gather the jwt access token from the request header
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
  
	var failed;
	try{
		await jwt.verify(token, 'token secret change me')
	} catch (err) {
		failed = err.message;
	}

	return failed || "Success"
}

module.exports = userController;

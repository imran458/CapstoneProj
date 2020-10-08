const { User } = require("../database/models");
const jwt = require("jsonwebtoken");

const authController = {
	login: login,
};


async function login(req, res, next) {
	try {
		const user = await User.findOne({ where: { email: req.body.email } });
		if (!user) {
			await User.create(req.body);
		}
		const token = await createToken(req.body);
		res.status(200).send(token);
	} catch (err) {
		next(err);
	}
}

async function createToken(body){
	return jwt.sign(body, 'token secret change me', { expiresIn: '1800s' });
}


module.exports = authController;

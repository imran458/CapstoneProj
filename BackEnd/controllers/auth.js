const { User } = require("../database/models");

const authController = {
	login: login,
	logout: logout,
	signup: signup,
	me: me
};

async function signup(req, res, next) {
	try {
		const user = await User.create(req.body);
		req.login(user, err => (err ? next(err) : res.json(user)));
	} catch (err) {
		if (err.name === "SequelizeUniqueConstraintError") {
			res.status(401).send("User already exists");
		} else {
			next(err);
		}
	}
}

async function login(req, res, next) {
	try {
		const user = await User.findOne({ where: { email: req.body.email } });
		if (!user) {
			res.status(401).send("Wrong username and/or password");
		} else if (!user.correctPassword(req.body.password)) {
			res.status(401).send("Wrong username and/or password");
		} else {
			req.login(user, err => (err ? next(err) : res.json(user)));
		}
	} catch (err) {
		next(err);
	}
}

async function logout(req, res, next) {
	req.logout();
	req.session.destroy(err => {
		if (err) {
			return next(err);
		} else {
			res.status(204).end();
		}
	});
}

async function me(req, res, next) {
	try {
		res.json(req.user);
	} catch (err) {
		console.log(err);
	}
}

module.exports = authController;

// Here, we will sync our database, create our application, and export this module so that we can use it in the bin directory, where we will be able to establish a server to listen and handle requests and responses;

// Require environmental variables if we are in development or testing;
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// Module dependencies;
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const passport = require("passport");
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require("cors");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Utilities;
const createLocalDatabase = require("./utilities/createLocalDatabase");
const seedDatabase = require("./utilities/seedDatabase");

// Our database instance;
const db = require("./database");
const sessionStore = new SequelizeStore({ db });

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
	try {
		const user = await db.models.user.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

// Our apiRouter;
const apiRouter = require("./routes/index");

// A helper function to sync our database;
const syncDatabase = async () => {
	if (process.env.NODE_ENV === "production") {
		db.sync();
	} else {
		console.log("As a reminder, the forced synchronization option is on");
		try {
			await db.drop();
			await db.sync({ force: true });
			await seedDatabase();
		} catch (err) {
			if (err.name === "SequelizeConnectionError") {
				await createLocalDatabase();
				await db.sync({ force: true });
				await seedDatabase();
			} else {
				console.log(err);
			}
		}
	}
};

const multerMid = multer({
	storage: multer.memoryStorage(),
	limits: {
	  fileSize: 5 * 1024 * 1024,
	},
})

// Instantiate our express application;
const app = express();

// A helper function to create our app with configurations and middleware;
const configureApp = () => {
	app.use(helmet());
	app.use(logger("dev"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(compression());
	app.use(cookieParser('secret'));

	app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			store: sessionStore,
			resave: false,
			saveUninitialized: false
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(multerMid.single('file'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))

	// Mount our apiRouter;
	app.use("/api", apiRouter);

	// Error handling;
	app.use((req, res, next) => {
		if (path.extname(req.path).length) {
			const err = new Error("Not found");
			err.status = 404;
			next(err);
		} else {
			next();
		}
	});

	// More error handling;
	app.use((err, req, res, next) => {
		console.error(err);
		console.error(err.stack);
		res.status(err.status || 500).send(err.message || "Internal server error.");
	});
};

app.get("/", (req, res, next) => {
	res.json("Welcome to the Digraffiti Backend");
});


app.listen(1234, '0.0.0.0', function () {
	console.log('App running on port 1234 and accessible on all IP addresses on local machine!');
});


// Main function declaration;
const bootApp = async () => {
	await sessionStore.sync();
	await syncDatabase();
	await configureApp();
};

// Main function invocation;
bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;

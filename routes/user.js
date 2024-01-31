import express from "express";
const router = express.Router();
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import pkg from "passport-jwt";
const { Strategy: JwtStrategy, ExtractJwt } = pkg;

//strategy for login with passport Json Web Token
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";

//strategy for login
passport.use(
	new JwtStrategy(opts, async function (jwt_payload, done) {
		try {
			const user = await User.findOne({ id: jwt_payload.sub });
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		} catch (err) {
			return done(err, false);
		}
	}),
);

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

//show the view login
router.get("/login", (req, res) => {
	res.render("login");
});

//login
//register user
router.post("/register", async (req, res) => {
	const { name, email, user, password } = req.body;
	try {
		const validate_email = await User.findOne({ email });
		const validate_user = await User.findOne({ user });
		console.log(validate_email, validate_user, "Las validaciones");
		if (validate_email || validate_user) {
			res.status(200).send("email o usuario ya registrado");
		} else {
			const newUser = new User({ name, email, user, password });
			await newUser.save();
			console.log("se creo todo bien");
			res.status(200).json({ user: newUser });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//logout
router.post("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

//get the current user
router.get("/currentuser", (req, res) => {
	const currentuser = req.user;
	res.json({ currentuser });
});

//show the view register user
router.get("/register", (req, res) => {
	res.render("register");
});

//register user
router.post("/login", async (req, res) => {
	const { user, password } = req.body;
	console.log(user, password, "Datos del usuario");
	try {
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.status(200).json({ user });
		});
	} catch (error) {
		console.log(error);
	}
});

export default router;

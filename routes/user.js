import express from "express";
const router = express.Router();
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pkg from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();
const { Strategy: JwtStrategy, ExtractJwt } = pkg;

//strategy for login with passport Json Web Token
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

function generateToken(user) {
	const payload = {
		sub: user.id,
		iat: Math.floor(Date.now() / 1000),
	};

	return jwt.sign(payload, opts.secretOrKey, { expiresIn: "24h" });
}

//strategy for login
passport.use(
	new LocalStrategy(
		{
			usernameField: "user",
			passwordField: "password",
		},
		async function (username, password, done) {
			try {
				const user = await User.findOne({ user: username });
				if (!user) {
					return done(null, false, { message: "Incorrect username." });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		},
	),
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
		if (validate_email || validate_user) {
			res.status(200).send("email o usuario ya registrado");
		} else {
			const newUser = new User({ name, email, user, password, role: "client" });
			await newUser.save();
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
router.post("/login", function (req, res, next) {
	passport.authenticate(
		"local",
		{ session: false },
		function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json(info);
			}

			const token = generateToken(user);
			res.json({ user, token });
		},
	)(req, res, next);
});

export default router;

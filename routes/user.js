import express from "express";
const router = express.Router();
import User from "../models/users.js";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";

import dotenv from "dotenv";
dotenv.config();

//Keys of Passport
let opts = {};
opts.secretOrKey = process.env.SECRET_OR_KEY;

//Keys of Google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

//Strategy for login with Google
passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: "http://www.example.com/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return cb(err, user);
			});
		},
	),
);

//strategy local for login local
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

//register user
router.post("/register", async (req, res) => {
	const { name, email, user, password } = req.body;
	try {
		const validate_email = await User.findOne({ email });
		const validate_user = await User.findOne({ user });
		if (validate_email || validate_user) {
			res.status(409).send("email o usuario ya registrado");
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
	res.status(200).send("Se ha cerrado la sesión correctamente");
});

//get the current user
router.get("/currentuser", (req, res) => {
	if (req.isAuthenticated()) {
		const currentuser = req.user;
		res.json({ currentuser });
	} else {
		res.status(401).send("No hay usuario logueado");
	}
});

//register user
router.post("/login", function (req, res, next) {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json(info);
		}
		res.status(200).json({ user });
	})(req, res, next);
});

//Login with Google
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.status(200).send("Usuario autenticado correctamente");
	},
);

export default router;

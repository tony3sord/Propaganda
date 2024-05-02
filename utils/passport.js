import dotenv from "dotenv";
import passport from "passport";
dotenv.config();

import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
//Keys of Passport
let opts = {};
opts.secretOrKey = process.env.SECRET_OR_KEY;

//Keys of Google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const configurePassport = (User) => {
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
            console.log(user, password);
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
};

export default configurePassport;

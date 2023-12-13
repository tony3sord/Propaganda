import express from 'express';
const router = express.Router();
import User from '../models/users.js'
import passport from 'passport';
import pkg from 'passport-jwt';
const { Strategy: JwtStrategy,ExtractJwt } = pkg;



let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));


router.get('/login', (req, res) => {
    res.render("login")
});

router.post('/login', (req, res) => {
    const {user,password} = req.body;
    try {
        req.logIn({user,password},done,err);
    } catch (error) {
        console.log(error);
    }
});

router.post('/logout',(req,res)=>{

})

router.get('/currentuser',(req,res)=>{
    const currentuser = req.user;
    res.json({currentuser});
})

export default router;
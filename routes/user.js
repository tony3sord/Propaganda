import express from 'express';
const router = express.Router();
import User from '../models/users.js'
import passport from 'passport';
import pkg from 'passport-jwt';
const { Strategy: JwtStrategy,ExtractJwt } = pkg;

//strategy for login with passport Json Web Token
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
//strategy for login 
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

//show the view login
router.get('/login', (req, res) => {
    res.render("login")
});

//login
router.post('/login', (req, res) => {
    const {user,password} = req.body;
    try {
        req.logIn({user,password},done,err);
    } catch (error) {
        console.log(error);
    }
});

//logout
router.post('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

//get the current user
router.get('/currentuser',(req,res)=>{
    const currentuser = req.user;
    res.json({currentuser});
})

//show the view register user
router.get('/register', (req, res) => {
    res.render('register');
})

//register user
router.post('/register', (req, res) => {
    const {name,email,user,password} = req.body;
    try {
        const validate = User.findOne({email});
        if(validate.length > 0){
            res.send("email ya registrado");
        }else{
            const newUser = new User({name,email,user,password});
            newUser.save();
            req.logIn({user,password},done,err);
        }
    } catch (error) {
        console.log(error);
    }
})


export default router;
import express from 'express';
const app = express();
import session from 'express-session';
import User from './models/users.js'
import userRoutes from './routes/user.js';
import passport from 'passport';


app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use('/user', userRoutes);



app.use(passport.initialize());
app.use(passport.session());


app.listen('3000',()=>{
    console.log("servidor listo, 3000");
})

import express from 'express';
import mongoose from 'mongoose'
const app = express();
import session from 'express-session';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';
import basketRoutes from './routes/basket.js';
import passport from 'passport';


app.use(express.json());

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/basket', basketRoutes);





main().catch((err) => console.log(err));
async function main(){
  try {
      mongoose.connect('mongodb://127.0.0.1/Propaganda');
      console.log('MongoDB se conectó');
  } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
  }
}

app.listen('3000',()=>{
    console.log("servidor listo, puerto: 3000");
})

export default app;
import express from 'express';
const router = express.Router();
import Buys from '../models/buys.js';

//show the view of the buys
router.get('/buys', async (req,res)=>{
    const buys = await Buys.find();
    // if(req.isAuthenticated()){
    //     if(req.user.role == "admin"){
    //         res.render('/buys',{buys});
    //     }else{
    //         res.redirect('/');
    //     }
    // }else{
    //     res.redirect('/login');
    // }
    res.render('/buys',{buys});
});

//to deliver a purchase
router.get('/deliveredbuys/:id', async (req,res)=>{
    const id = req.params.id;
    try{
        await Buys.findByIdAndUpdate(id,{delivered:true});
    }catch(error){
        console.log(error);
    }
    res.redirect('/buys')
})

router.post('/buy',async (req,res)=>{
    //Buy Here
})
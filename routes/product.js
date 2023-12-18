import express from 'express';
const router = express.Router();
import Products from '../models/products.js';


//show the view add a product
router.get('/addproduct', (req, res) => {
    // if(req.isAuthenticated()){
    //     if(req.user.role=="admin"){
    //         res.render('addproduct');
    //     }else{
    //         res.redirect('/');
    //     }
    // }else{
    //     res.redirect('/login');
    // }
    res.render('addproduct');
})    

//add a product
router.post('/addproduct',async (req, res) => {
    const {name,price,description,image,category,amount} = req.body;
    try {
        const newProduct = new Products({
            name,
            price,
            description,
            image,
            category,
            amount
        });
        await newProduct.save();
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
})

//show the view edit a product
router.get('/editproduct/:id', async (req, res) => {
    const id = req.params.id;
    // if(req.isAuthenticated()){
    //     if(req.user.role=="admin"){
    //         //Here the product is edited
    //         Products.findById(id, (err, doc) => {
    //             if(err){
    //                 console.log(err);
    //             }else{
    //                 res.render('editproduct', {product:doc});
    //             }
    //         })
    //     }else{
    //         res.redirect('/');
    //     }   
    // }else{
    //     res.redirect('/login');
    // }    
    await Products.findById(id, (err, doc) => {
        if(err){
            console.log(err);
        }else{
            res.render('editproduct', {product:doc});
        }
    })
});

//edit a product
router.post('/editproduct/:id', async (req, res) => {
    const {name,price,description,image,category,amount} = req.body;
    try {
        //edit a product
        await Products.findByIdAndUpdate(req.params.id, {
            name,
            price,
            description,
            image,
            category,
            amount
        }, (err, doc) => {
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        })
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})

//delete a product
router.delete('/removeproduct/:id', async (req, res) => {
    const id = req.params.id;
    // if(req.isAuthenticated()){
    //     if(req.user.role=="admin"){
    //         //Here the product is deleted
    //     }else{
    //         res.redirect('/');
    //     }
    // }else{
    //     res.redirect('/login');
    // }    
    await Products.findByIdAndDelete(id, (err, doc) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })  
})

router.get('/products', async (req, res) => {
    await Products.find({}, (err, docs) => {
        if(err){
            console.log(err);
        }else{
            res.render('products', {products:docs});
        }
    })
})    

export default router;
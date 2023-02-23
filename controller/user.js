const User = require('../model/user.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const Product = require('../model/product.js');


module.exports.login=async(req,res,next)=>{
    const {email,password : pass}=req.body;
    try{
        const cuurentUser=await User.findOne({email:email});
        if(!cuurentUser){
            const error=new Error('Invalid Email');
            error.statusCode=422;
            throw error;
        }
        const isPasswordMatch=await bcrypt.compare(pass,cuurentUser.password);
        if(!isPasswordMatch){
            const error=new Error('Invalid Password');
            error.statusCode=422;
            throw error;
        };
        const {password,...other} = cuurentUser.toJSON();
        //  start create token
        const token=jwt.sign({
            userId:cuurentUser._id.toString(),
        },
        "secretToken"
        );
        res.status(200).json({user:other, token:token});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
}

module.exports.register = async(req,res,next)=>
{
    try{
        const {name ,password , email} = req.body;
        const foundUser = await User.findOne({email:email});
        if(foundUser){
            const error = new Error('Email already used');
            error.statusCode = 403;
            throw error;
        }
        const hashPass = await bcrypt.hash(password,12);
        const user = new User({name:name,password:hashPass , email:email});
        await user.save()
        res.status(201).json({message:'User register success'});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
}


module.exports.getSingleUser = async (req,res,next) =>{
    const {userId} = req.params;
    try{
        const user = await User.findById(userId).populate('favourites.productId').populate('cart.productId');
        res.status(200).json({user});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
}


module.exports.faviroteProduct = async (req,res,next) => {
    const userId = req.userId;
    const {productId} = req.params;
    try{
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        if(user.favourites.find(p=> p.productId.toString() === productId)){
            user.favourites =  user.favourites.filter(p=> p.productId.toString() !== productId);
            product.favourites = product.favourites.filter(u=>u.userId.toString() !== userId);
        }
        else{
            user.favourites.push({productId:productId});
            product.favourites.push({userId:userId});
        }
        await user.save();
        await product.save();
        res.status(201).json({mesaage:"success"});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
} 

module.exports.addProductToCart = async (req,res,next) => {
    const userId = req.userId;
    const {productId} = req.params;
    const {qty , color , size} = req.body;
    try{
        const user = await User.findById(userId);
        user.cart.push({productId:productId , qty:qty , color:color , size:size});
        await user.save();
        res.status(201).json({mesaage:"success add to cart"});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
} 

module.exports.deleteProductFromCart = async (req,res,next) => {
    const userId = req.userId;
    const {cardItemId} = req.params;
    try{
        const user = await User.findById(userId);
        user.cart  = user.cart.filter(cp=>cp._id.toString() !== cardItemId.toString());
        await user.save();
        res.status(201).json({mesaage:"success add to cart"});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
} 


module.exports.getLastAlllUsers = async (req,res,next) => {
    try{
        const users = await User.find();
        res.status(200).json({users});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
}
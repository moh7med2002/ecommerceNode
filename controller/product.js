const Product = require('../model/product');
const Category = require('../model/Category')
const User = require('../model/user');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


module.exports.createProduct = async(req,res,next) =>{
    try{
        const {sizes , title , colors , categoryId , price} = req.body;
        if(!req.file){
            const error = new Error('upload image is required');
            error.statusCode = 404;
            throw error;
        }
        const product = new Product({
            title : title,
            image : req.file.filename,
            sizes : sizes.split(','),
            colors: colors.split(','),
            categoryId: categoryId,
            price: +price
        });
        await product.save();
        res.status(201).json({message:"Product has been created"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }  
}

module.exports.getProducts = async (req,res,next) => {
    try{
        let products ;
        if(req.query.categoryId){
            products = await Product.find({categoryId:new mongoose.Types.ObjectId(req.query?.categoryId)}).populate('categoryId')
        }
        else{
            products = await Product.find().populate('categoryId');;
        }
        res.status(200).json({products});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    } 
}

module.exports.getLastProducts = async(req,res,next) => {
    try{
        const products = await Product.find().sort('createdAt:"-1').limit(10);
        res.status(200).json({products});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    } 
}

module.exports.getProductById = async (req,res,next) => {
    const {productId} = req.params;
    try{
        const product = await Product.findById(productId).populate('reviews.userId');
        res.status(200).json({product});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    } 
}


module.exports.updateProduct = async (req,res,next) => {
    const {productId} = req.params;
    const {title , colors , price , sizes} = req.body;
    try{
        const product = await Product.findById(productId);
        if(! product) {
            const error = new Error('Product not found');
            error.statusCode = 409;
            throw error;
        }
        if(req.file) {
            // clearImage(product.image);
            product.image = req.file.filename;
        }
        product.title = title;
        product.price = +price;
        product.colors = colors.split(',');
        product.sizes = sizes.split(',');
        await product.save();
        res.status(201).json({message:"Product has been updated"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    } 
}


module.exports.deleteProduct = async (req,res,next) => {
    const {productId} = req.params;
    try{
        const product = await Product.findById(productId);
        if(! product) {
            const error = new Error('Product not found');
            error.statusCode = 409;
            throw error;
        }
        // if( product.image){
        //     clearImage(product.image);
        // }
        await product.delete();
        res.status(201).json({message:"Product has been deleted"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    } 
}

exports.getProductsByDepartment = async(req,res,next)=>
{
    try{
        const {departmentId} = req.params
        const categories = await Category.find({departmentId:departmentId})
        let allProducts = [];
        for(const category of categories)
        {
            const products = await Product.find({categoryId:category._id}).populate('categoryId')
            allProducts.push(...products)
        }
        res.status(200).json({allProducts , categories})
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}


module.exports.reviewProduct = async (req,res,next) => {
    const userId = req.userId;
    const productId = req.params.productId;
    const {rating , comment , date} = req.body;
    try{
        const product = await Product.findById(productId);
        product.reviews.push({userId:userId , rating:+rating , date:date , comment:comment});
        await product.save();
        res.status(201).json({message:"product review success"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}



const clearImage=(filePath)=>{
    filePath=path.join(__dirname,'..',`images/${filePath}`);
    fs.unlink(filePath,(err)=>{
        console.log(err);
    })
}
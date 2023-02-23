const Category = require('../model/Category');
const mongoose = require('mongoose');


module.exports.createCategory = async (req,res,next) =>{
    const {title , departmentId} = req.body;
    try{
        const foundCategory = await Category.findOne({title:title , departmentId:new mongoose.Types.ObjectId(departmentId)});
        if(foundCategory){
            const error = new Error('This Category already found');
            error.statusCode = 409;
            throw error;
        }
        const newCategory = new Category({
            title : title,
            departmentId : departmentId
        });
        await newCategory.save();
        res.status(201).json({message:"category has been created"});
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

module.exports.getCategory = async (req,res,next) => {
    try{
        let categories ;
        if(req.query.departmentId){
            categories = await Category.find({departmentId:new mongoose.Types.ObjectId(req.query?.departmentId)}).populate('departmentId')
        }
        else{
            categories = await Category.find().populate('departmentId');;
        }
        res.status(200).json({categories});
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
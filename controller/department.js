const Department = require('../model/Departments');
const Category = require('../model/Category');

exports.createDepartment = async(req,res,next)=>
{
    try{
        const {title} = req.body;
        if(!req.file){
            const error = new Error('upload image is required');
            error.statusCode = 404;
            throw error;
        }
        const foundDepartment = await Department.findOne({title:title});
        if(foundDepartment){
            const error = new Error('This Department already found');
            error.statusCode = 409;
            throw error;
        }
        const newDepartment = new Department({
            title : title,
            image : req.file.filename
        });
        await newDepartment.save();
        res.status(201).json({message:"department has been created"});
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

module.exports.getDepartment = async (req,res,next) => {
    try{
        const departments = await Department.find();
        res.status(201).json({departments});
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

module.exports.getNumberOfCategoryForEcahDepartment = async(req,res,next) =>{
    try{
        const data = await Category.aggregate([
            {
                $group:{
                    _id:"$departmentId",
                    count:{$sum:1}
                }
            }
        ]);
        for (const da of data) {
            const department = await Department.findById(da._id);
            da._id = department.title;
        }
        res.status(200).json({data});
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
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sizes:{
        type : Array,
        default :[]
    },
    colors:{
        type : Array,
        default :[]
    },
    categoryId:{type:mongoose.Types.ObjectId,required:true , ref:"Category"},
    reviews:[
        {
            userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"},
            rate:{type:Number,required:true},
        }
    ],
    rate:{
        type : Number,
        default : 0
    },
    favourites:[
        {
            userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"},
        }
    ],
    reviews:[
        {
            rating:{type:Number,required:true},
            comment:{type:String,required:true},
            date:{type:Date,required:true},
            userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"}
        }
    ]
},
{timestamps:true})

module.exports = mongoose.model('Product',productSchema)
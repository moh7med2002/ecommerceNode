const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    cart:[
        {
            productId:{type:mongoose.Types.ObjectId,required:true,ref:"Product"},
            qty:{type:Number,required:true},
            color:{type:String , required:true},
            size:{type:String , required:true}
        },
    ],
    favourites:[
        {
            productId:{type:mongoose.Types.ObjectId,required:true,ref:"Product"},
        }
    ]
})

module.exports = mongoose.model('User',userSchema)
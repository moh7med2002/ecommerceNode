const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"},
    totalPrice:{type:Number,required:true},
    products:[
        {
            title:{type:String,required:true},
            image:{type:String,required:true},
            qty:{type:Number,required:true},
            price:{type:Number,required:true},
            size:{type:String,required:true},
            color:{type:String,required:true}
        }
    ],
    isDelivey:{type:Boolean,required:true},
    address:{type:String,required:true},
    country:{type:String,required:true},
    city:{type:String,required:true},
    phone:{type:String,required:true},
    postalCode:{type:String,required:true}
},{timestamps:true})

module.exports = mongoose.model('Order',userSchema)
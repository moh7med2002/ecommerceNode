const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title:{type:String,required:true},
    departmentId:{type:mongoose.Types.ObjectId,required:true , ref:"Department"}
})

module.exports = mongoose.model('Category',categorySchema)
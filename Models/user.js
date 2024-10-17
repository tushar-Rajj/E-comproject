const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Review = require("./review.js");
const passportlocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,

    },
    role: {
        type: String,
        enum: ['user', 'owner'],
        required: true
    }

});

userSchema.plugin(passportlocalMongoose); 
module.exports=mongoose.model("User",userSchema);



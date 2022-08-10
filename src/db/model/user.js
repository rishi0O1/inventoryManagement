const mongoose = require('mongoose');
const Schema = require("mongoose").Schema ;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken") ;

const secretKey = "secretKey" ;

const UserSchema = Schema({
    name: {
        type: String ,
        required: [true , "Profile name not provides"] ,
    },
    email: {
        type: String ,
        unique: true ,
        required: [true , "Email not provides"] ,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: props => `${props.value} is not a valid Email!`
        }
    },
    password: {
        type: String,
        required: [true , "password is not provided by the user"] ,
        validate: {
            validator: function(value){
                return !value.toLowerCase().includes("password") ;
            },
            message: props => `${props.value} is not a valid Password!`
        },

    },
    role: { type: String },
    token: {
        type: String ,
    }
})

UserSchema.statics.findByCredentials = async (email , password) => {
    if(!email || !password) throw new Error("user not found") ;
    const user = await User.findOne({ email }) ;
    if(!user) throw new Error("user not found") ;
    let isMatch = await bcrypt.compare(password , user.password) ;
    if(!isMatch) throw new Error(" in-correct password "+isMatch) ;
    return user ;
}

UserSchema.methods.generateAndSaveToken = async function(){
    const token = jwt.sign({ "_id": this["_id"].toString() } , secretKey) ;
    console.log(token)
    this.token = token ;
    await this.save() ;
    return token ;
}

UserSchema.methods.hashPassword = async function(next){
    this.password = await bcrypt.hash(this.password , 8) ;
}

const User = new mongoose.model("User" , UserSchema) ;

module.exports = User ;
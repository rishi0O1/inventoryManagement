const express = require('express');
const router = express.Router() ;
const User = require("../db/model/user") ;
const Role = require("../db/model/role.enum") ;
const auth = require("../middleware/auth") ;
const authorization = require("../middleware/authrisation") ;

router.get("/user" , auth , authorization(Role.owner) , (req , res) => {
    User.find({}).then((users) => {
        res.send(users) ;
    })
})

router.post("/user/login" , async (req , res) => {

    const { email , password } = req.body || {} ;
    
    try{
        const user = await User.findByCredentials(email , password) ;
        if(!user) {
            res.status(200).send({
                "message": "Incorrect Credentials , no user found" ,
            })
        }
        const token = user.generateAndSaveToken() ;
        res.status(200).send({
            message: "successfully loged in to the system" ,
            data: {
                user , token
            }
        });
    } catch(e) {
        console.log(e) ;
        res.send({
            "message": "Incorrect Credentials " ,
        })
    }
})

router.post("/user/signup" , async (req , res) => {
    const { email , password , role , name} = req.body ;
    console.log(email , password , role , name) ;
    if(!email || !password){
        res.status(400).send({
            "message": "in-correct creadentials  , empty " ,
        })
    }
    const newUser = new User({
        email , password , role: Role[role.toLowerCase()] , name ,
    });
    try{
        await newUser.hashPassword() ;
        await newUser.save() ;
        res.send({
            "message": "signed up successfully",
            data: newUser ,
        })
    } catch(e) {
        console.log(e) ;
        res.send({
            "message": "error in signup , please contact admin" ,
        })
    }
})

console.log("user router") ;

module.exports = router ;
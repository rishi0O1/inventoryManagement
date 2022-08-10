const mongoose = require('mongoose') ;
const { dbUsername , dbPassword , dbName} = require("../credentials.json") ;

const connectionUrl = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.j4vrt7n.mongodb.net/${dbName}?retryWrites=true&w=majority` ;

const result = mongoose.connect(connectionUrl).then((res) => {
    console.log("DB connection successfull !") ;
}).catch((e) => {
    console.log(e) ;
}) ;

mongoose.SchemaTypes.String.set('trim', true);

// const Product = require('./model/product');

// const newProduct = new Product({
//     name: "test" ,
// })

// newProduct.save() ;

// const User = require("./model/user") ;

// const newUser = new User({
//     "name": "rishij" ,
//     "email": "test1@gmail.com" ,
//     "password": "rishij123" ,
//     role:  "manager",
// })
// newUser.save() ;

// const Role = require("./model/role") ;
// const newRole = new Role({
//     name: "Manager" ,
// });
// newRole.save() ;
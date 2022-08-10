const mongoose = require("mongoose") ;

const storeSchema = new mongoose.Schema({
    name: {
        type: String ,
    },
    role: {
        type: Map ,
        of: String ,
    }
},{ timestamps: true })

const Role = mongoose.model("Store" , roleSchema) ;

module.exports = Role ;
const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    email : {
        type : String,
        required :false
    },
    name : {
        type : String,
        required :false
    },
    image : {
        type : String,
        required :false
    },
    password: {
        type : String,
        required :false
    },
    address:[{
        type: mongoose.ObjectId,
        ref: 'Address'
    }], 
})
const User= mongoose.model('User',userSchema);
module.exports = User

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema =  mongoose.Schema({
    user_id:{type : String,
        required :false}, 
    type: {
        type : String,
        required :false
    } ,
    city: {
        type : String,
        required :false
    } ,
    pin: {
        type : String,
        required :false
    } ,
    state: {
        type : String,
        required :false
    } 
})
const Address=mongoose.model('Address',AddressSchema)
module.exports = Address

                    
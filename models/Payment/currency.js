const mongoose = require("mongoose");
const randomstring = require("randomstring");

const currencySchema = new mongoose.Schema({

 currencyId: {
    type: String, default: randomstring.generate(10)
 },
 propertyId: {type: String, required: true},
 currencySortCode: {type: String, default: ''},
     symbol : {
       type :   String 
    },
     name : {
       type :   String 
    },
     symbol_native : {
       type :   String 
    },
     decimal_digits : {
       type :  number 
    },
     code : {
       type :   String 
    },
     name_plural : {
       type :   String 
    },
    exchangeRate: {type:String, default: ''},
    country: {type: String, default: ''},
    addedBy: { type: String, default: '' },
    modifiedBy: { modifiedBy: { type: String, default: '' } },
    modifiedDate: { modifiedDate: { type: String, default: '' } },
    timeStamp: { type: String }
  
})

const currencyModel = mongoose.model("currency", currencySchema)
module.exports = currencyModel
const mongoose = require('mongoose')
const randomstring = require('randomstring')

const propertyType = new mongoose.Schema({
    propertyId : {type:String , default:randomstring.generate(10)},
    propertyType : {type : String , default : ""}
})

const propertyTypedata = mongoose.model("propertyType",propertyType)
module.exports = propertyTypedata 
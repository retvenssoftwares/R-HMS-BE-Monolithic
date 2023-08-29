const mongoose = require('mongoose')
var randomstring = require("randomstring");


const propertySetupSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    propertyId: {type: String, default:randomstring.generate(10)},
    propertySortKey: {type: String, default: ''},
    propertyName: {type: String, required: true, default: ''},
    propertyWebsiteLink: {type: String, required: false, default: ''},
    propertyAddress: {type: String, required: false, default: ''},
    propertyState: {type:String, required: false, default: ''},
    propertyCity: {type:String, required: false, default: ''},
    propertyPinCode: {type:String, required: false, default: ''},
    propertyBasicCurrency: {type:String, required: false, default: ''},
    propertyStarCategory: {type:String, required: false, default: ''},
    numberOfRooms: {type:String, required: false, default: ''},
    taxName: {type:String, required: false, default: ''},
    propertyTaxPercentage: {type: String, required: false, default: ''},
    numberOfRooms: {type:String, required: false, default: ''},
    propertyLogo: {type: String, required: false, default: ''},
    propertyRegistrationNo: {type: String, required: true, unique: true, default: ''},
    timeStamp: {type: String},
    propertyAmenities: {
        amenityId:{type:String,default:''},
        displayStatus: {type: String, default: "1"}
    },
})

const propertySetupModel = mongoose.model('property', propertySetupSchema);
module.exports = propertySetupModel;
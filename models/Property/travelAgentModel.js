const mongoose = require('mongoose')
var randomstring = require("randomstring");


const travelAgentSchema = new mongoose.Schema({
    travelAgentId: {type: String, default:randomstring.generate(10)},
    propertyId: {type: String, default:''},
    travelAgentBusinessName: {type: String, required: true, default: ''},
    travelAgentName: {type: String, required: true, default: ''},
    travelAgentWebsiteLink: {type: String, required: false, default: ''},
    travelAgentLogo: {type: String, required: false, default: ''},
    state: {type: String, required: false, default: ''},
    country: {type:String, required: false, default: ''},
    pincode: {type:String, required: false, default: ''},
    telephoneNo: {type:String, required: false, default: ''},
    mobileNo: {type:String, required: false, default: ''},
    timeStamp: {type: String, default: ''},
    addedBy: {type: String, default: '' },
    modifiedBy: { modifiedBy: {type: String, default: ''}},
    modifiedDate: {modifiedDate:{type: String, default: ''}},
    socialMedia1: {type: String, default: '' },
    socialMedia2: {type: String, default: ''},
    socialMedia3: {type: String, default: ''}
})

const travelAgentModel = mongoose.model('travelAgent', travelAgentSchema);
module.exports = travelAgentModel;
const mongoose = require('mongoose')
var randomstring = require("randomstring");


const propertySetupSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    propertyId: {type: String, default:randomstring.generate(10)},
    propertySortKey: {type: String, default: ''},
    propertyName: {type: String, required: true, default: ''},
    propertyWebsiteLink: {type: String, required: false, default: ''},
    propertyAddress: {type: String, required: false, default: ''},
    propertyLocation: {type: String, default: ''},
    propertyRatings: [{
        avgRating: {type: String, default: ''},
        location: {type: String, default: ''},
        cleaning: {type: String, default: ''},
        service: {type: String, default: ''},
        price: {type: String, default: ''}
    }],
    roomType: [{
        roomTypeId: {type: String, required: false}
    }],
    // propertyState: {type:String, required: false, default: ''},
    // propertyCity: {type:String, required: false, default: ''},
    propertyPinCode: {type:String, required: false, default: ''},
    propertyBasicCurrency: {type:String, required: false, default: ''},
    propertyStarCategory: {type:String, required: false, default: ''},
    numberOfRooms: {type:String, required: false, default: ''},
    taxName: {type:String, required: false, default: ''},
    propertyTaxPercentage: {type: String, required: false, default: ''},
    numberOfRooms: {type:String, required: false, default: ''},
    phoneNo: {type:String, required: false, default: ''},
    email: {type:String, required: false, default: ''},
    propertyDescription: {type: String, default: ''},
    propertyLogo: {type: String, required: false, default: ''},
    propertyImages: [{
        propertyImage: {type: String, default: ''}
    }],
    propertyRegistrationNo: {type: String, required: true, unique: true, default: ''},
    timeStamp: {type: String},
    propertyAmenities: [{
        amenityId:{type:String,default:''},
        displayStatus: {type: String, default: "1"}
    }],
    addedBy: {type: String, default: '' },
    modifiedBy: { modifiedBy: {type: String, default: ''}},
    modifiedDate: {modifiedDate:{type: String, default: ''}},
    socialMedia1: {type: String, default: '' },
    socialMedia2: {type: String, default: ''},
    socialMedia3: {type: String, default: ''}
})

const propertySetupModel = mongoose.model('property', propertySetupSchema);
module.exports = propertySetupModel;
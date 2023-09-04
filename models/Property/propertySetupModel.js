const mongoose = require('mongoose')
var randomstring = require("randomstring");


const propertySetupSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    propertyId: { type: String, default: randomstring.generate(10) },
    propertySortKey: { type: String, default: '' },
    propertyName: { type: String, required: false, default: '' },
    propertyWebsiteLink: { type: String, required: false, default: '' },
    propertyAddress: { type: String, required: false, default: '' },
    propertyLocation: { type: String, default: '' },
    propertyRatings: [{
        avgRating: { type: String, default: '' },
        location: { type: String, default: '' },
        cleaning: { type: String, default: '' },
        service: { type: String, default: '' },
        price: { type: String, default: '' }
    }],
    roomType: [{
        roomTypeId: { type: String, required: false }
    }],
    propertyState: { type: String, required: false, default: '' },
    propertyCity: { type: String, required: false, default: '' },
    propertyPinCode: { type: String, required: false, default: '' },
    propertyBasicCurrency: { type: String, required: false, default: '' },
    propertyStarCategory: { type: String, required: false, default: '' },
    numberOfRooms: { type: Number, required: false, default: 0 },
    taxName: { type: String, required: false, default: '' },
    propertyTaxPercentage: { type: String, required: false, default: '' },
    phoneNo: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    propertyDescription: { type: String, default: '' },
    propertyLogo: { type: String, required: false, default: '' },
    propertyImages: [{
        propertyImageId: { type: String, default: randomstring.generate(10) },
        propertyImage: { type: String, default: '' },
        displayStatus: { type: String, default: '1' }
    }],
    propertyRegistrationNo: { type: String, required: false, unique: true, default: '' },
    propertyType: { type: String, default: '' },
    numberOfProperties: { type: Number, default: 0 }, //for hotel chain
    propertyChainType: { type: String, default: '' }, //for hotel chain
    hotelBasicCurrency: {type: String, default: ''},//for hotel chain
    propertyChainStarCategory: { type: String, default: ''}, //for hotel chain
    timeStamp: { type: String, default: '' },
    propertyAmenities: [{
        amenityId: { type: String, default: '' },
        displayStatus: { type: String, default: "1" }
    }],
    addedBy: { type: String, default: '' },
    modifiedBy: [{ modifiedBy: { type: String, default: '' } }],
    modifiedDate: [{ modifiedDate: { type: String, default: '' } }],
    socialMedia1: { type: String, default: '' },
    socialMedia2: { type: String, default: '' },
    socialMedia3: { type: String, default: '' }
})

const propertySetupModel = mongoose.model('property', propertySetupSchema);
module.exports = propertySetupModel;
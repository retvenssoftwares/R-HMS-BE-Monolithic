const mongoose = require('mongoose');
var randomstring = require("randomstring");

const roomTypeSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    propertyId: {type: String, default:'', unique: true},
    roomTypeId: {type: String, default:randomstring.generate(10)},
    roomTypeSortKey: {type: String, default: ''},
    roomTypeName: {type: String, required: true, default: ''},
    maxChild: {type: Number, required: false, default: ''},
    maxAdult: {type: Number, required: false, default: ''},
    extraAdultRate: {type: String, default: ''},
    extraChildRate: {type: String, default: ''},
    maxRoomOccupancy: {type:Number, required: false, default: ''},
    roomTypeInventory: {type:Number, required: false, default: ''},
    baseRate: {type: String, default: ''},
    roomTypeDescription: {type: String, default: ''}, 
    rateThresholdMin: {type: String, default: ''},
    rateThresholdMax: {type: String, default: ''},
    ratePlan: {
        ratePlanId: {type: String, default:''}
    },
    rateType: {
        rateTypeId: {type: String, default:''}
    },
    roomTypeAmenities: {
        amenityId:{type:String,default:''},
        displayStatus: {type: String, default: "1"}
    },
    roomTypeImages: {
        roomImage: {type: String, default: ""}
    },
    addedBy: {type: String, default: '' },
    modifiedBy: { modifiedBy: {type: String, default: ''}},
    modifiedDate: {modifiedDate:{type: String, default: ''}},
    timeStamp: {type: String}
})

const roomTypeModel =  mongoose.model('roomType', roomTypeSchema);
module.exports = roomTypeModel;
const mongoose = require('mongoose')
var randomstring = require("randomstring");

const roomTypeSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    propertyId: {type: String, default:'', unique: true},
    roomTypeId: {type: String, default:randomstring.generate(10)},
    roomTypeSortKey: {type: String, default: ''},
    roomTypeName: {type: String, required: true, default: ''},
    maxChild: {type: Number, required: false, default: ''},
    maxAdult: {type: Number, required: false, default: ''},
    maxRoomOccupancy: {type:Number, required: false, default: ''},
    roomTypeInventory: {type:Number, required: false, default: ''},
    roomTypeAmenities: {
        amenityId:{type:String,default:''},
        displayStatus: {type: String, default: "1"}
    },
})

const roomTypeModel =  mongoose.model('roomType', roomTypeSchema);
module.exports = roomTypeModel;
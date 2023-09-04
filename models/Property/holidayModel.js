const mongoose = require("mongoose");
const randomstring = require("randomstring");


const holidaySchema = new mongoose.Schema({

    holidayId: { type: String, default: randomstring.generate(10) },
    propertyId: { type: String, required: true},
    holidaySortCode: {type: String, default: ''},
    
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    
    description: { type: String, default: '' },
    addedBy: { type: String, default: '' },
    modifiedBy:[{ modifiedBy: { type: String, default: '' } }],
    modifiedDate: [{ modifiedDate: { type: String, default: '' } }],
    timeStamp: { type: String },

});

const amenities = mongoose.model("holidays", holidaySchema)
module.exports = amenities
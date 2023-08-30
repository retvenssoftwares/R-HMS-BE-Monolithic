const mongoose = require('mongoose');
var randomstring = require("randomstring");

const guestSchema = new mongoose.Schema({
    guestId: {type: String, required: true, unique: true},
    guestName: {type: String, default:'', unique: true},
    guestEmail: {type: String, default:randomstring.generate(10)},
    guestMobileNo: {type: String, default: ''},
    guestAddress: {type: String, required: false, default: ''},
    reservationStatus: {type: String},        
    identityName: {type: String, default: ''},
    identityType: {type: String, default: ''},
    nationality: {type:String, default: ''},
    dob: {type:String, default: ''},
    guestCountry: {type: Number, required: false, default: ''},
    guestPreferences: {preferenceName: {type: String, default: ''}},
    addedBy: {type: String, default: '' },
    modifiedBy: { modifiedBy: {type: String, default: ''}},
    modifiedDate: {modifiedDate:{type: String, default: ''}},
    timeStamp: {type: String},    
})

const guestModel =  mongoose.model('guests', guestSchema);
module.exports = guestModel;
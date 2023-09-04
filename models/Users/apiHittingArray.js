const mongoose = require('mongoose');

const apihitting = new mongoose.Schema({
    propertyId: { type: String},
    apiArray : [{
        apiname : {type : String , default : ""},
        timestamp : {type : String , default : ""},
        userId: {type: String, default: ''},
        role : {type :String , default : ""},
        deviceType: { type: String, default: ''},
        ipAddress: {type: String, default: ''},
    }] 
});

const data = mongoose.model('apihit_details', apihitting);
module.exports = data

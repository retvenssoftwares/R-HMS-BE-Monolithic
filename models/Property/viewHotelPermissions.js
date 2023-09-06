const mongoose = require('mongoose')
var randomstring = require("randomstring");

const viewHotelPermissionSchema = new mongoose.Schema({
    propertyId: { type: String, default: '' },
    hotelViewPermissions: [{
        propertyId: { type: String, default: '' },
        propertyAuthCode: { type: String, default: "", required: true },
    }],
})

const viewHotelPermissionModel = mongoose.model("hotelViewPermissions", viewHotelPermissionSchema);
module.exports = viewHotelPermissionModel;
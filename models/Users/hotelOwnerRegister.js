const mongoose = require("mongoose");

const randomstring = require("randomstring");

const registerSchema = new mongoose.Schema({
  userId: { type: String, default: randomstring.generate(10) },

  fullName: { type: String, default: "", required: true },

  DOB: { type: String, default: "", required: false },

  userName: { type: String, required: true, unique: true },

  designation: { type: String, default: "", required: false },

  email: { type: String, default: "", required: true },

  role: { type: String, default: "", required: true },

  userSortKey: { type: String, default: '' },

  password: [{
    password: { type: String, required: true },
  }],

  propertyType: { type: String, default: "", required: false },

  permissions: [{
    permissionsId: { type: String, default: '' },
    permissionTypeName: {type: String, default: ''},
    permissionShortKey: {type: String, default: ''},
    permissionName: [{
      subPermissionId: {type: String, default: ''},
      subPermission: {type: String, default: ''}
    }]
  }],

  hotelViewPermissions: [{
    propertyId: { type: String, default: '' },
    propertyAuthCode: { type: String, default: "", required: true },
  }],


  mobile: { type: String, default: "", required: false },

  deviceType: {
    ipAddress: { type: String, default: "", required: false },

    deviceTypename: { type: String, default: "", required: false },

    location: { type: String, default: "", required: false },

    osVersion: { type: String, default: "", required: false },

    osType: { type: String, default: "", required: false },
  },

  hotelName: { type: String, default: "", required: false },

  hotelCount: { type: Number, default: 0, required: false },

  timeStamp: { type: String, default: "", required: false },

  registrationId: { type: String, default: '' },

  blockedUntil: { type: Number, default: 0 },

  loginAttempts: { type: Number, default: 0 },

  propertyId: { type: String, default: randomstring.generate(10) },


});


const hotelOwnerRegistration = mongoose.model("hotelOwnerRegister", registerSchema);
module.exports = hotelOwnerRegistration;

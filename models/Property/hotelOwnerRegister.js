const mongoose = require("mongoose");

const randomestring = require("randomstring");

const registerSchema = new mongoose.Schema({
  userId: { type: String, default: randomestring.generate(10) },

  fullName: { type: String, default: "", required: false },

  userName: { type: String, required: true, unique: true },

  designation: { type: String, default: "", required: false },

  email: { type: String, default: "", required: false },

  role: { type: String, default: "", required: false },

  password: {
    password: { type: String, required: true },
  },

  propertyType: { type: String, default: "", required: false },

  mobile: { type: Number, default: "", required: false },

  deviceType: {
    ipAddress: { type: String, default: "", required: false },

    deviceTypename: { type: String, default: "", required: false },

    location: { type: String, default: "", required: false },

    osVersion: { type: String, default: "", required: false },

    osType: { type: String, default: "", required: false },
  },

  hotelName: { type: String, default: "", required: false },

  hotelCount: { type: Number, default: "", required: false },

  timeStamp: { type: String, default: "", required: false },
});


const hotelOwnerRegistration = mongoose.model("hotelOwnerRegister",registerSchema);
module.exports = hotelOwnerRegistration;

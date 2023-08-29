const mongoose = require("mongoose");
const randomestring = require("randomstring");

const rateTypeSchema = new mongoose.Schema({
  roomTypeId: {type: String, default:randomestring.generate(10)},

  rateTypeId: {type: String, default:randomestring.generate(10)},

  rateType: {type: String, default: "", required: false },

  rateSortKey: {type: String, default: "", required: false},

  totalDays : {type: String, default: "", required: false },

  ratePlaneName: {type: String, required: false},

  baseRate: {type: String, default: "", required: false },

  extraAdult: {type: String, default: "", required: false},

  extraChildRate: {type: String, required: false },

  rateThreshold: {type: String, default: "", required: false },

  rateTypeAmenities:{

    amenityId: {type: String, default: "", required: false },

    displayStatus: {type: String, default: "1"},

  },

  timeStamp : { type: String, default: "", required: false }

});


const rateplan = mongoose.model("rateType", rateTypeSchema)
module.exports = rateplan
const mongoose = require("mongoose");
var randomstring = require("randomstring");

const roomTypeSchema = new mongoose.Schema({
//   userId: { type: String, required: true, unique: true },
  propertyId: { type: String, default: ""},
  roomTypeId: { type: String, default: randomstring.generate(10) },
  roomTypeSortKey: { type: String, default: "" },
  roomTypeName: { type: String, required: false, default: "" },
  baseAdult: { type: Number, required: false, default: 0 },
  baseChild: { type: Number, required: false, default: 0 },
  maxChild: { type: Number, required: false, default: 0 },
  maxAdult: { type: Number, required: false, default: 0 },
  extraAdultRate: { type: String, default: "" },
  extraChildRate: { type: String, default: "" },
  maxRoomOccupancy: { type: Number, required: false, default: 0 },
  roomTypeInventory: { type: Number, required: false, default: 0 },
  baseRate: { type: String, default: "" },
  roomTypeDescription: { type: String, default: "" },
  rateThresholdMin: { type: String, default: "" },
  rateThresholdMax: { type: String, default: "" },

  ratePlanIdArray: [
    {
      ratePlanId: { type: String, default: "" },
    },
  ],

  rateTypeIdArray: [
    {
      rateTypeId: { type: String, default: "" },
    },
  ],

  roomTypeAmenities: [
    {
      amenityId: { type: String, default: "" },
      displayStatus: { type: String, default: "1" },
    },
  ],

  roomTypeImages: [{
    roomImage: { type: String, default: "" },
  }],


  addedBy: { type: String, default: "" },
  modifiedBy: [{ modifiedBy: { type: String, default: "" } }],
  modifiedDate: [{ modifiedDate: { type: String, default: "" } }],
  timeStamp: { type: String, default: "" },
});

const roomTypeModel = mongoose.model("roomType", roomTypeSchema);
module.exports = roomTypeModel;

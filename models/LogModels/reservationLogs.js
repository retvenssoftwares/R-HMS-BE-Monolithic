import mongoose from "mongoose";
import db2 from "../../db/conn2.js";

const reservationLogModel = new mongoose.Schema({
    propertyId: { type: String, default: "", unique: false },
  reservationTypeId: { type: String, default: "" },
 
 
  createdBy: { type: String, default: "" },
  createdOn: { type: String, default: "" },

  reservationName: [
    {
      reservationName: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
      modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    },
  ],
  status: [
    {
      status: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
      modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    },
  ],
  modifiedBy: [
    {
      modifiedBy: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
      modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    },
  ],

  modifiedOn: [
    {
      modifiedOn: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    },
  ],
});

const reservationLog = db2.model("reservationLogModel", reservationLogModel);
export default reservationLog;

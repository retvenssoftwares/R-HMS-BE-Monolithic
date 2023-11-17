import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const mealPlanLogModel = new mongoose.Schema({
  propertyId: {
    type: String,
    default: "",
  },

  mealPlanId: {
    type: String,
    default: "",
  },

  shortCode: [
    {
      shortCode: {
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: "",
      },
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

  mealPlanName: [
    {
      mealPlanName: {
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: "",
      },
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

  chargesPerOccupancy: [
    {
      chargesPerOccupancy: {
        type: String,
        default: "",
      },
      logId: { 
        type: String, 
        default:"",
      },
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
  createdBy: {
    type: String,
    default: "",
  },

  createdOn: {
    type: String,
    default: "",
  },

  modifiedBy: [
    {
      modifiedBy: {
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: "",
      },
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
      logId: {
        type: String,
        default: "",
      },
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
});
const mealPLanLog = db2.model("mealPlanLogModel", mealPlanLogModel);
export default mealPLanLog;

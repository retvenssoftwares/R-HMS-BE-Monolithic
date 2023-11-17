import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const inclusionLogModel = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      default: "",
    },
    inclusionId: {
      type: String,
      default: "",
    },
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
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
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
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],

    shortCode: [
      {
        shortCode: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],

    chargeRule: [
      {
        chargeRule: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],

    postingRule: [
      {
        postingRule: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],

    charge: [
      {
        charge: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],

    inclusionName: [
      {
        inclusionName: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],
    inclusionType: [
      {
        inclusionType: {
          type: String,
          default: "",
        },
        logId: { type: String, default: "" },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const inclusionLog = db2.model("inclusionLogModel", inclusionLogModel);
export default inclusionLog;

import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const amenitiesLogModel = new mongoose.Schema(
  {
    propertyId: {
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
        logId: {
          type: String,
          default: "",
        },
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
        logId: {
          type: String,
          default: "",
        },
        modifiedOn: {
          type: String,
          default: "",
        },
        userId: {
          type: String,
          default: "",
        },
        ipAddress: {
          type: String,
          default: "",
        },
        deviceType: {
          type: String,
          default: "",
        },
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

    amenityId: {
      type: String,
      default: "",
    },

    amenityName: [
      {
        amenityName: {
          type: String,
          default: "",
        },
        logId: {
          type: String,
          default: "",
        },
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

    amenityType: [
      {
        amenityType: {
          type: String,
          default: "",
        },
        logId: {
          type: String,
          default: "",
        },
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

    amenityIcon: [
      {
        amenityIcon: {
          type: String,
          default: "",
        },
        logId: {
          type: String,
          default: "",
        },
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

    amenityIconLink: [
      {
        amenityIconLink: {
          type: String,
          default: "",
        },
        logId: {
          type: String,
          default: "",
        },
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

const amenitiesLog = db2.model("amenitiesLogModel", amenitiesLogModel);
export default amenitiesLog;

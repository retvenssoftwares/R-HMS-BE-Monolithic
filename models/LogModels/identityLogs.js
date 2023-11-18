import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const identityLogModel = new mongoose.Schema({

    shortCode: [{
        shortCode: {
            type: String,
            default: ''
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
    }],

    createdBy: {
        type: String,
        default: ''
    },

    createdOn: {
        type: String,
        default: ''
    },

    modifiedBy: [{
        modifiedBy: {
            type: String,
            default: ''
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
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
        logId: {type: String, default: ""},
          userId: {
            type: String,
            default: "",
          },
          ipAddress: { type: String, default: "" },
          deviceType: { type: String, default: "" },
    }],

    identityType: [{
        identityType: {
            type: String,
            default: ''
        },
        logId: {type: String, default: ""},
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
    }],

    propertyId: {
        type: String,
        default: ''
    },

    identityTypeId: {
        type: String,
        default: ''
    },

});

const identityLog = db2.model('identityLogModel', identityLogModel);
export default identityLog;
import mongoose from "mongoose";
import db2 from "../../db/conn2.js";

const paymentLogModel = new mongoose.Schema({
    shortCode: [{
        shortCode: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
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
    }],

    paymentTypeId: {
        type: String,
        default: ""
    },
    receivedTo: [{
        receivedTo: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ''
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
    }],
    propertyId: {
        type: String,
        default: ''
    },

    paymentMethodName: [{
        paymentMethodName: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
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
        logId: {
            type: String,
            default: ''
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
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
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
    }],

}, {
    versionKey: false
});

const paymentLog=db2.model("paymentLogModel", paymentLogModel);
export default paymentLog;
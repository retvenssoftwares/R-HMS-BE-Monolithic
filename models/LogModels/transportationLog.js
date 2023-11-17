import mongoose from "mongoose";
import db2 from "../../db/conn2.js";

const transportationLogModel = new mongoose.Schema({
    transportationId: {
        type: String,
        default: ""
    },
    shortCode: [{
        shortCode: {
            type: String,
            default: ""
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
    }],
    transportationModeName: [{
        transportationModeName: {
            type: String,
            default: ""
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
    }],
    createdBy: {
        type: String,
        default: ""
    },
    createdOn: {
        type: String,
        default: ""
    },
    propertyId: {
        type: String,
        default: ""
    },
    modifiedBy: [{
        modifiedBy: { type: String, default: "" },
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
    }],
    modifiedOn: [{
        modifiedOn: { type: String, default: "" },
        logId: { type: String, default: "" },
    
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }]

}, {
    versionKey: false
})

const transportationLog = db2.model("transportationLogModel", transportationLogModel)
export default transportationLog;
import mongoose, { Mongoose, Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const businessSources = new mongoose.Schema({

    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],    
    sourceId: {
        type: String,
        default: ""
    },
    shortCode: [{
        shortCode: {
            type: String,
            default: ""
        }, logId: {
            type: String,
            default: ""
        },
    }],
    propertyId: {
        type: String,
        default: ""
    },
    sourceName: [{
        sourceName: {
            type: String,
            default: ""
        }, logId: {
            type: String,
            default: ""
        },
    }],
    createdBy: {
        type: String,
        default: ""
    },
    createdOn: {
        type: String,
        default: ""
    },
    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
        },
    }],
    modifiedBy: [{
        modifiedBy: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
        },
    }]
}, {
    versionKey: false
})

const businessSourcesModel = db1.model("businessSources", businessSources)
export default businessSourcesModel
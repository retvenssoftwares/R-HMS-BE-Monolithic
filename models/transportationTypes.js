import mongoose, { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const transportation = new Schema({
    transportationId: {
        type: String,
        default: ""
    },
    shortCode: [{
        shortCode: {
            type: String,
            default: ""
        },
        logId: { type: String, default: "" }
    }],
    transportationModeName: [{
        transportationModeName: {
            type: String,
            default: ""
        },
        logId: { type: String, default: "" }
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
        logId: { type: String, default: "" }
    }],
    modifiedOn: [{
        modifiedOn: { type: String, default: "" },
        logId: { type: String, default: "" }
    }]

}, {
    versionKey: false
})

const transportationModel = db1.model("transportation", transportation)
export default transportationModel
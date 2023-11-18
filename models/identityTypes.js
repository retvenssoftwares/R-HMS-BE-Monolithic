import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const identityTypeSchema = new mongoose.Schema({

    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],

    shortCode: [{
        shortCode: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
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
        logId: { type: String, default: "" }
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
        logId: {type: String, default: ""}
    }],

    identityType: [{
        identityType: {
            type: String,
            default: ''
        },
        logId: {type: String, default: ""}
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

const identity = db1.model('identityType', identityTypeSchema);
export default identity;
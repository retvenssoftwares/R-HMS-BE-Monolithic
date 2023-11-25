import mongoose, { Mongoose, Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const guestTypeSchema = new mongoose.Schema({

    propertyId: { type: String, default: '', unique: false },
    guestId: { type: String, default: '' },
    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],
    shortCode: [{
        shortCode: {
            type: String,
            default: ''
        },
        logId: { type: String, default: '' }
    }],
    modifiedBy: [{
        modifiedBy: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    modifiedOn: [{
        modifiedOn: { type: String, default: ''},
        logId: { type: String, default: ''}
    }],
    createdBy: {
        type: String,
        default: ''
    },
    createdOn: {
        type: String,
        default: ''
    },
    guestTypeName: [
        {
            guestTypeName: { type: String, default: '' },
            logId: { type: String, default: '' }
        }
    ],
   
}, {
    versionKey: false
})

const guestTypeModel = db1.model("guestType", guestTypeSchema)
export default guestTypeModel
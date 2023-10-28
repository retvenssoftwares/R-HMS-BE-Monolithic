import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const holidaySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

    holidayId: {
        type: String,
        default: ''
    },

    shortCode: [{
        shortCode: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
    }],

    holidayName: [{
        holidayName: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
    }],

    startDate: [{
        startDate: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
    }],

    endDate: [{
        endDate: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
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
        }
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
    }],


}, {
    versionKey: false
});

const holiday = db1.model('holiday', holidaySchema);

export default holiday;
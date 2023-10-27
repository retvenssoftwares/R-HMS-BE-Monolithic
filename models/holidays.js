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

    shortCode: {
        type: String,
        default: ''
    },

    holidayName: [{
        holidayName: {
            type: String,
            default: ''
        },
    }],

    startDate: [{
        startDate: {
            type: String,
            default: ''
        },
    }],

    endDate: [{
        endDate: {
            type: String,
            default: ''
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
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
    }],

   


});

const holiday = db1.model('holiday', holidaySchema);

export default holiday;
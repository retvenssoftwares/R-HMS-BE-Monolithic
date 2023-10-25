import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const seasonSchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

    seasonId: {
        type: String,
        default: ''
    },

    shortCode: {
        type: String,
        default: ''
    },

    seasonName: [{
        seasonName: {
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

    days: [{
        days: [{
            type: String,
            default: ''
        }]
    }],


});

const season = db1.model('season', seasonSchema);

export default season;
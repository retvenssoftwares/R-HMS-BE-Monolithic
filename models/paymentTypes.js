import { Schema, model, mongoose } from 'mongoose';
import db1 from "../db/conn.js"
const paymentTypeSchema = new mongoose.Schema({

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

    paymentTypeId: {
        type: String,
        default: ''
    },
    receivedTo: [{
        receivedTo: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        }
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

const payment = db1.model('paymentType', paymentTypeSchema);
export default payment;
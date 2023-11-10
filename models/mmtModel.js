import mongoose from 'mongoose'
import db1 from '../db/conn.js'

const mmtSchema = mongoose.Schema({
    otaId: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: ''
    },
    propertyId: {
        type: String,
        default: ''
    },
    otaPropertyId: {
        type: String,
        default: ''
    },
    accessToken: {
        type: String,
        default: ''
    },
    mappingData: [{
        otaRatePlanId: {
            type: String,
            default: ''
        },
        linkedRatePlanId: {
            type: String,
            default: ''
        }
    }]
}, {
    versionKey: false
});

const mmtModel = db1.model("mmt", mmtSchema)
export default mmtModel
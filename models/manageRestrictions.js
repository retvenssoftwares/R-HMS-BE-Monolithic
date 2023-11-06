import mongoose from 'mongoose'
import db1 from '../db/conn.js'

const manageRestrictions = mongoose.Schema({
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    ratePlanId: { type: String, default: '' },
    source: { type: String, default: "" },

    manageRestrictions: {
        stopSell: [{
            stopSell: { type: String, default: "false" },
            date: { type: String, default: "" }
        }],
        COA: [{
            COA: { type: String, default: "false" },
            date: { type: String, default: "" }
        }],
        COD: [{
            COD: { type: String, default: "false" },
            date: { type: String, default: '' }
        }],
        minimumLOS: [{
            minimumLOS: { type: Number, default: 0 },
            date: { type: String, default: '' }
        }],
        maximumLOS: [{
            maximumLOS: { type: Number, default: 0 },
            date: { type: String, default: '' }
        }]
    }
}, {
    versionKey: false
});

const restrictions = db1.model('restrictions', manageRestrictions);
export default restrictions;
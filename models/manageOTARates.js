import mongoose from 'mongoose'
import db1 from '../db/conn.js'

const manageOTARates = mongoose.Schema({
    otaId: { type: String, default: "" },
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    ratePlanId: { type: String, default: '' },
    source: { type: String, default: "" },
    manageOTARates: {
        baseRate: [{
            baseRate: { type: String, default: '' },
            date: { type: String, default: "" }
        }],
        extraChildRate: [{
            date: { type: String, default: "" },
            extraChildRate: { type: String, default: "" }
        }],
        extraAdultRate: [{
            date: { type: String, default: "" },
            extraAdultRate: { type: String, default: "" }
        }],
    }
}, {
    versionKey: false
});

const OTARates = db1.model('manageOTArates', manageOTARates);
export default OTARates;

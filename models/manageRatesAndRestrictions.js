import mongoose from 'mongoose'
import db1 from '../db/conn.js'

const manageRates = mongoose.Schema({
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    ratePlanId: { type: String, default: '' },
    source: { type: String, default: "" },
    manageRates: {
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

const rates = db1.model('managerates', manageRates);
export default rates;

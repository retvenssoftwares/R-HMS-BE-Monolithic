import mongoose from "mongoose"
import db1 from "../db/conn.js"

const discountPlanSchema = new mongoose.Schema({
    propertyId: { type: String, default: "" },
    discountPlanId: { type: String, default: "" },
    discountName: [{
        discountName: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    displayStatus: [{
        displayStatus: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    shortCode: [{
        shortCode: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    discountType: [{
        discountType: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    discountPercent: [{
        discountPercent: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    discountPrice: [{
        discountPrice: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    validityPeriodFrom: [{
        validityPeriodFrom: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    validityPeriodTo: [{
        validityPeriodTo: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    blackOutDates: [{
        blackOutDates: [{
            type: String,
            default: ''
        }],
        logId: { type: String, default: '' }
    }],
    applicableOn: [{
        applicableOn: [{
            roomTypeId: { type: String, default: '' },
            ratePlans: [{
                rateplanId: { type: String, default: '' },
                newRatePlanPrice: { type: String, default: "" }
            }]
        }],
        logId: { type: String, default: "" }
    }]
}, {
    versionKey: false
});

const discountPlanModel = db1.model("discountPlans", discountPlanSchema)
export default discountPlanModel;
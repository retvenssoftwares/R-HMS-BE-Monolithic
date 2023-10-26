import mongoose from "mongoose"
import db2 from "../../db/conn2.js"

const discountPlanLogsSchema = new mongoose.Schema({
    propertyId: String,
    discountPlanId: { type: String, default: "" },
    discountName: [{
        logId: { type: String, default: "" },
        discountName: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    shortCode: [{
        logId: { type: String, default: "" },
        shortCode: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    discountType: [{
        logId: { type: String, default: "" },
        discountType: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    discountPercent: [{
        logId: { type: String, default: "" },
        discountPercent: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    discountPrice: [{
        logId: { type: String, default: "" },
        discountPrice: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    validityPeriodFrom: [{
        logId: { type: String, default: "" },
        validityPeriodFrom: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    validityPeriodTo: [{
        logId: { type: String, default: "" },
        validityPeriodTo: { type: String, default: "" },
        userId: { type: String, default: "" },
        modifiedDate: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

    blackOutDates: [{
        logId: { type: String, default: "" },
        request: { type: String, default: '' },
        response: { type: String, default: '' }
    }],
    applicableOn: [{
        logId: { type: String, default: "" },
        request: { type: String, default: '' },
        response: { type: String, default: '' }
    }]
},
    {
        versionKey: false
    });

const discountPlanLogModel = db2.model("discountPlans", discountPlanLogsSchema)

export default discountPlanLogModel
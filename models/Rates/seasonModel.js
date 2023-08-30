const mongoose = require('mongoose')
var randomstring = require("randomstring");

const seasonalRatePlanSchema = new mongoose.Schema({
    seasonId: { type: String, default: randomstring.generate(10) },
    propertyId: { type: String, required: true },
    ratePlanId: { type: String, required: true },
    seasonName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    roomRates: {
        roomTypeId: { type: String, required: true },
        rate: { type: String, required: true },
    },
    minimumStay: { type: Number, default: 1 },
    maximumStay: { type: Number },
    bookingWindowStart: { type: String },
    bookingWindowEnd: { type: String },
    restrictions: {
        minGuests: { type: Number },
        maxGuests: { type: Number },
        daysOfWeek: {
            day: { type: String }
        },
        cancellationPolicy: {
            policyType: { type: String },
            penaltyPercentage: { type: Number },
            daysBeforeCheckIn: { type: Number }
        },
        additionalInfo: { type: String },
        isActive: { type: String, default: "false" },
    },
    timeStamp: { type: String },
    addedBy: { type: String, default: '' },
    modifiedBy: { modifiedBy: { type: String, default: '' } },
    modifiedDate: { modifiedDate: { type: String, default: '' } },
});

module.exports = mongoose.model('SeasonalRatePlan', seasonalRatePlanSchema);

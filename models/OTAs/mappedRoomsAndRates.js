import mongoose from 'mongoose'
import db1 from '../../db/conn.js'

const mmtSchema = mongoose.Schema({
    otaId: {
        type: String,
        default: ''
    },
    connectionId: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        default: ''
    },
    hotelRcode: {
        type: String,
        default: ''
    },
    mmtHotelCode: {
        type: String,
        default: ''
    },
    createdOn: {
        type: String, default: ''
    },
    createdBy: {
        type: String,
        default: ''
    },
    accessToken: {
        type: String,
        default: ''
    },
    mappedOTARoomData: [{
        otaRoomTypeCode: {
            type: String,
            default: ''
        },
        roomTypeId: {
            type: String,
            default: ''
        }
    }],
    mappedRatePlanData: [{
        otaRoomTypeCode: {
            type: String,
            default: ''
        },
        roomTypeId: {
            type: String,
            default: ''
        },

        ratePlanId: {
            type: String,
            default: ''
        },
        otaRatePlanCode: {
            type: String,
            default: ''
        },
        rateRule: [{
            rateRuleType: { //% or amount
                type: String,
                default: ""
            },
            changeType: {
                type: String, //increase or decrease
                default: ""
            },
            adjustmentValue: {
                type: String, //value in % or amount
                default: ""
            }
        }]
    }]
}, {
    versionKey: false
});

const roomAndRateMap = db1.model("mappedOTAData", mmtSchema)
export default roomAndRateMap
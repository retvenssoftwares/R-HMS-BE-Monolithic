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

}, {
    versionKey: false
});

const mmtModel = db1.model("mmtConnection", mmtSchema)
export default mmtModel
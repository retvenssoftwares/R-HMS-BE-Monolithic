import mongoose from "mongoose";
import db2 from '../../db/conn2.js';

const channelLogsSchema = mongoose.Schema({
    propertyId: {
        type: String,
        default: ''
    },
    otaId: {
        type: String,
        default: ""
    },
    channelLogs: [{
        userId: {
            type: String,
            default: ""
        },
        roomTypeId: {
            type: String,
            default: ""
        },
        ratePlanId: {
            type: String,
            default: ""
        },
        deviceType: {
            type: String,
            default: ''
        },
        ipAddress: {
            type: String,
            default: ''
        },
        addedOn: {
            type: String,
            default: ''
        },
        logHeading: {
            type: String,
            default: ""
        },
        logDescription: {
            type: String,
            default: ''
        }
    }]

},
    { versionKey: false }
)

const channelLogsModel = db2.model("channelLogs", channelLogsSchema);
export default channelLogsModel
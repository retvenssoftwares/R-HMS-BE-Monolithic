import mongoose from "mongoose"
import db2 from "../../db/conn2.js"

const otainventoryLogSchema = mongoose.Schema({
    propertyId: {
        type: String,
        default: "",
    },
    logs: [{
        logId: {
            type: String,
            default: "",
        },
        request: {
            type: String,
            default: "",
        },
        response: {
            type: String,
            default: "",
        },
        modifiedOn: {
            type: String,
            default: "",
        },
        userId: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }]
});

const otaInventoryLogsModel = db2.model("otaInventoryLogs", otainventoryLogSchema)
export default otaInventoryLogsModel;
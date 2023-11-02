import mongoose from "mongoose"
import db1 from "../db/conn.js"

const manageInventorySchema = new mongoose.Schema({
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    ratePlanId: { type: String, default: '' },
    source: { type: String, default: "" },
    manageInventory: {
        addedInventory: [{
            addedInventory: { type: Number, default: "" },
            date: { type: String, default: "" }
        }],
        blockedInventory: [{
            blockedInventory: { type: Number, default: "" },
            date: { type: String, default: '' }
        }],
    },
}, {
    versionKey: false
})

const manageInventoryModel = db1.model("manageInventory", manageInventorySchema);
export default manageInventoryModel;
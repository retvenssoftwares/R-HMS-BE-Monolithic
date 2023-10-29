import mongoose from "mongoose"
import db1 from "../db/conn.js"

const manageInventorySchema = new mongoose.Schema({
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    manageInventory: [{
        inventory: { type: String, default: "" },
        date: { type: String, default: "" },
        isBlocked: { type: String, default: "" }
    }]
})

const manageInventoryModel = new db1.model("manageInventory", manageInventorySchema);
export default manageInventoryModel;
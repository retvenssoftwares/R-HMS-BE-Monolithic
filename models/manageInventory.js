import mongoose from "mongoose"
import db1 from "../db/conn.js"

const manageInventorySchema = new mongoose.Schema({
    propertyId: { type: String, default: "" },
    roomTypeId: { type: String, default: "" },
    ratePlanId: { type: String, default: '' },
    source: { type: String, default: "" },
    manageInventory: [{
        addedInventory: { type: Number, default: "" },
        blockedInventory: { type: Number, default: "" },
        date: { type: String, default: "" }
    }],
    manageRates: [{
        date: { type: String, default: "" },
        baseRate: { type: String, default: '' },
        extraChildRate: { type: String, default: "" },
        extraAdultRate: { type: String, default: "" }
    }],
    manageRestrictions: [{
        date: { type: String, default: "" },
        stopSell: { type: String, default: "false" },
        COA: { type: String, default: "false" },
        COD: { type: String, default: "false" },
        minimumLOS: { type: Number, default: 0 },
        maximumLOS: { type: Number, default: 0 },
    }]
}, {
    versionKey: false
})

const manageInventoryModel = new db1.model("manageInventory", manageInventorySchema);
export default manageInventoryModel;
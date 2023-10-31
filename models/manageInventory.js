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
    manageRates: {
        baseRate: [{
            baseRate: { type: String, default: '' },
            date: { type: String, default: "" }
        }],
        extraChildRate: [{
            date: { type: String, default: "" },
            extraChildRate: { type: String, default: "" }
        }],
        extraAdultRate: [{
            date: { type: String, default: "" },
            extraAdultRate: { type: String, default: "" }
        }],
    },
    manageRestrictions: {
        stopSell: [{
            stopSell: { type: String, default: "false" },
            date: { type: String, default: "" }
        }],
        COA: [{
            COA: { type: String, default: "false" },
            date: { type: String, default: "" }
        }],
        COD: [{
            COD: { type: String, default: "false" },
            date: { type: String, default: '' }
        }],
        minimumLOS: [{
            minimumLOS: { type: Number, default: 0 },
            date: { type: String, default: '' }
        }],
        maximumLOS: [{
            maximumLOS: { type: Number, default: 0 },
            date: { type: String, default: '' }
        }],
    }
}, {
    versionKey: false
})

const manageInventoryModel = new db1.model("manageInventory", manageInventorySchema);
export default manageInventoryModel;
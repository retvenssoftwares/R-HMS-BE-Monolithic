import mongoose from "mongoose"
import db2 from "../../db/conn2.js"

const discountPlanLogsSchema = new mongoose.Schema({
    propertyId: String,
    data: [{
        request: { type: String, default: '' },
        response: { type: String, default: '' }
    }]
},
{
    versionKey: false
});

const discountPlanLogModel = db2.model("discountPlans", discountPlanLogsSchema)

export default discountPlanLogModel
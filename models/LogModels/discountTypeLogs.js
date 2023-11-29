import mongoose from "mongoose"
import db2 from "../../db/conn2.js"

const discountTypeLogsSchema = new mongoose.Schema({
    
    propertyId: { type: String, default: "" },
    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],

    discountTypeId: { type: String, default: "" },
      
},
{
    versionKey: false
});
const discountPlanLogModel = db2.model("discountPlans", discountTypeLogsSchema)

export default discountPlanLogModel
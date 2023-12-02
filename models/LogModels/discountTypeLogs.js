import mongoose from "mongoose"
import db2 from "../../db/conn2.js"

const discountTypeLogsSchema = new mongoose.Schema({
    
    propertyId: { type: String, default: "" },
    
    discountTypeId: { type: String, default: "" },
    createdBy: {
        type: String,
        default: "",
      },
    
    createdOn: {
        type: String,
        default: "",
      },
    shortCode: [
        {
          shortCode: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
      displayStatus: [
        {
          displayStatus: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
      discountTypeName: [
        {
            discountTypeName: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
      discountValue: [
        {
            discountValue: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
      discountType: [
        {
            discountType: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
      discountPercent: [
        {
            discountPercent: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],

      discountPrice: [
        {
            discountPrice: {
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: "",
          },
          modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
        },
      ],
    },  

{
    versionKey: false
});
const discountPlanLogModel = db2.model("discountTypeLogs", discountTypeLogsSchema)

export default discountPlanLogModel
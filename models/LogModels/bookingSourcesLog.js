import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const bookingSourceLogModel =new  mongoose.Schema({

    propertyId: { type: String, default: '', unique: false },
    bookingSourceId: { type: String, default: '' },

    shortCode: [{
        shortCode: {
            type: String,
            default: ""
        }, logId: {
            type: String,
            default: ""
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
    }],
    displayStatus: [{
      displayStatus: {
            type: String,
            default: ""
        }, logId: {
            type: String,
            default: ""
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
    }],
    modifiedBy: [{
        modifiedBy: { type: String, default: "" },
        logId: { type: String, default: '' },
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
    }],
    modifiedOn: [{
        modifiedOn: { type: String, default: "" },
        logId: { type: String, default: '' },
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
    }],
    createdBy: { type: String, default: '' },
    createdOn: { type: String, default: '' },
    bookingSource: [
        {
            bookingSource: { type: String, default: '' },
            logId: { type: String, default: '' },
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
        }
    ]

}, {
    versionKey: false
});

const bookingSourceLog = db2.model("bookingSourceLogModel", bookingSourceLogModel)
export default bookingSourceLog;
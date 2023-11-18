import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const businessSourcesLogModel = new mongoose.Schema({
    sourceId: {
        type: String,
        default: ""
    },
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
    propertyId: {
        type: String,
        default: ""
    },
    sourceName: [{
        sourceName: {
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
    createdBy: {
        type: String,
        default: ""
    },
    createdOn: {
        type: String,
        default: ""
    },
    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
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
        modifiedBy: {
            type: String,
            default: ""
        },
        logId: {
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
    }]
}, {
    versionKey: false
})

const businessSourcesLog = db2.model("businessSourcesLogModel", businessSourcesLogModel)
export default businessSourcesLog
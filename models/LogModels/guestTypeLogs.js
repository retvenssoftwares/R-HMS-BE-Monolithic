import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const guestTypeModel = new mongoose.Schema({
    guestId: {
        type: String,
        default: "",
      },
    propertyId : {
        type: String,
        default: ''
    },
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
      guestTypeName: [
        {
            guestTypeName: {
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
        versionKey : false
    
    },
);

const guestTypesLog = db2.model("guestTypeModel", guestTypeModel);
export default guestTypesLog;
import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const seasonLogModel = new mongoose.Schema({
  propertyId: {
    type: String,
    default: "",
  },

  seasonId: {
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

  seasonName: [
    {
      seasonName: {
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

  startDate: [
    {
      startDate: {
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

  endDate: [{
      endDate: { type: String, default: "",},
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

  createdBy: {
    type: String,
    default: "",
  },

  createdOn: {
    type: String,
    default: "",
  },

  days: [
    {
      days: [
        {
          type: String,
          default: "",
        },
      ],
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

const seasonsLog = db2.model("seasonLogModel", seasonLogModel);

export default seasonsLog;

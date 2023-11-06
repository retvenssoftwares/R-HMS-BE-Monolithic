import { mongoose, Schema, model } from "mongoose";
import db2 from "../../db/conn2.js";
const companyRatePlanLogs = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      default: "",
    },
    companyRatePlanId: {
      type: String,
      default: "",
    },
    rateType: {
      type: String,
      default: "",
    },
    roomTypeId: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },

    ratePlanName: [
      {
        ratePlanName: {
          type: String,
          default: "",
        },
        logId:{
          type: String,
          default: "",
        },
        request: { type: String, default: "" },
        response: { type: String, default: "" },
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

    ratePlanInclusion: [
      {
        ratePlanInclusion: [
          {
            inclusionId: {
              type: String,
              default: "",
            },
            inclusionName: {
              type: String,
              default: "",
            },
            inclusionType: {
              type: String,
              default: "",
            },
            postingRule: {
              type: String,
              default: "",
            },
            chargeRule: {
              type: String,
              default: "",
            },
            rate: {
              type: String,
              default: "",
            },
          },
        ],

        logId: {
          type: String,
          default: "",
        },

        request: { type: String, default: "" },
        response: { type: String, default: "" },
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

    ratePlanName: [
      {
        ratePlanName: {
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

    inclusionTotal: [
      {
        inclusionTotal: {
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
    ratePlanTotal: [
      {
        ratePlanTotal: {
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
    versionKey: false,
  }
);

const companyRatePlanModelLogs = db2.model("companyRatePlaneLogs", companyRatePlanLogs);
export default companyRatePlanModelLogs;

import { mongoose, Schema, model } from "mongoose";

const companyRatePlan = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      default: "",
    },
    compnayRatePlanId: {
      type: String,
      default: "",
    },
    rateType: {
      type: String,
      default: "",
    },
    roomType: {
      type: String,
      default: "",
    },

    rantePlanInclusion: [
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

    ratePlanName: [
      {
        ratePlanName: {
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
      },
      
    ],

    inclusionTotal: {
      type: String,
      default: "",
    },
    ratePlanTotal: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
  }
);

const companyRatePlanModel = new mongoose.model(
  "compnayRatePlane",
  companyRatePlan
);
export default companyRatePlanModel;

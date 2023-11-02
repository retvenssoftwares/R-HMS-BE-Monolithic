import { mongoose, Schema, model } from "mongoose";
import db1 from "../db/conn.js"
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
    roomTypeId: {
      type: String,
      default: "",
    },
    companyName:{
      type: String,
      default: "",
    },
    createdBy:{
      type:String,
      default:""
  },
    createdOn:{
        type:String,
        default:""
    },
    
    ratePlanInclusion: [{
      ratePlanInclusion:[{
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
      }],

      logId: {
        type: String,
        default: ""
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
          default: ""
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
          default: ""
      },
    
      },
      
    ],


    inclusionTotal: [{
      inclusionTotal:{
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: ""
    },
   
     
    }],
    ratePlanTotal: [{
      ratePlanTotal:{
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: ""
    },
   
    }],
  },
  {
    versionKey: false,
  }
);

const companyRatePlanModel = db1.model(
  "companyRatePlan",
  companyRatePlan
);
export default companyRatePlanModel;

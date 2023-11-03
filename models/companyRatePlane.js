import { mongoose, Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const companyRatePlan = new mongoose.Schema(
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
    
    mealPlan:[{
      mealPlanId: {
       type:String,
       default:"",
       },
       logId: {
           type: String,
           default: ""
       }
    }],
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

    barRates:{
      roomBaseRate:[{
        roomBaseRate:{
          type: String,
            default: ""
        },
        logId: {
          type: String,
          default: ""
      },
      }],
      mealCharge:[{
        mealCharge:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
        
      }],
      inclusionCharge:[{
        inclusionCharge:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
      }],
      roundUp:[{
        roundUp:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
      }],
      extraAdultRate:[{
        extraAdultRate:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
    
      }],
      extraChildRate:[{
        extraChildRate:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
    
      }],
      ratePlanTotal:[{
        ratePlanTotal:{
          type: String,
          default: ""
        },
        logId: {
          type: String,
          default: ""
      },
      }]
    
    }
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

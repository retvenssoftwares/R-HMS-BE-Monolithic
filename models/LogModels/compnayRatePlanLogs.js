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
    companyId: {
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
        logId:{
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
    barRates:{
      roomBaseRate:[{
        roomBaseRate:{
          type: String,
            default: ""
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
      }],
      mealCharge:[{
        mealCharge:{
          type: String,
          default: ""
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
        
      }],
      inclusionCharge:[{
        inclusionCharge:{
          type: String,
          default: ""
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
      }],
      roundUp:[{
        roundUp:{
          type: String,
          default: ""
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
      }],
      extraAdultRate:[{
        extraAdultRate:{
          type: String,
          default: ""
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
    
      }],
      extraChildRate:[{
        extraChildRate:{
          type: String,
          default: ""
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
    
      }],
      ratePlanTotal:[{
        ratePlanTotal:{
          type: String,
          default: ""
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
      }]
    
    },
    // ratePlanTotal: [
    //   {
    //     ratePlanTotal: {
    //       type: String,
    //       default: "",
    //     },
    //     logId: {
    //       type: String,
    //       default: "",
    //     },
    //     modifiedOn: {
    //       type: String,
    //       default: "",
    //     },
    //     userId: {
    //       type: String,
    //       default: "",
    //     },
    //     ipAddress: {
    //       type: String,
    //       default: "",
    //     },

    //     deviceType: {
    //       type: String,
    //       default: "",
    //     },
    //   },
    // ],
  },
  {
    versionKey: false,
  }
);

const companyRatePlanModelLogs = db2.model("companyRatePlaneLogs", companyRatePlanLogs);
export default companyRatePlanModelLogs;

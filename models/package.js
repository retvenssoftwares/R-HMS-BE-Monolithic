import mongoose from  "mongoose"
import db1 from "../db/conn.js"
const packagePlan = new mongoose.Schema({

    propertyId : {
        type: String,
        default: "",
    },

    packageId:{
        type: String,
        default: "",
    },

    rateType:{
        type: String,
        default: "",
    },

    roomTypeId:{
        type: String,
        default: "",
    },

    ratePlanId:{
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
    displayStatus: [
        {
          displayStatus: {
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

      minimumNights:[{
        minimumNights:{
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: ""
        },
      }],

      maximumNights:[{
        maximumNights:{
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: ""
        },
      }],

      packageRateAdjustment:[{
        packageRateAdjustment:[{
        adjustment:{
            type: String,
            default: "",
        },
        percentage:{
            type: String,
            default: "",
        },
        amount:{
          type: String,
          default: "",
        },
        changeType: {
          type: String, //increase or decrease
          default: ""
      }, 
      }],
      logId: {
        type: String,
        default: ""
    }
    }],

    
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
  
      barRates:{
        packageTotal:[{

          packageTotal:{
            type: String,
          default: "",
          },
          logId: {
            type: String,
            default: ""
           },

        }],
        extraAdultRate:[{
          extraAdultRate:{
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: ""
           },
         
        }],
        extraChildRate:[{
          extraChildRate:{
            type: String,
            default: "",
          },
          logId: {
            type: String,
            default: ""
           },
         
        }],
      }
},
{
    versionKey: false,
}

);

const packageRatePlanModel = db1.model(
    "packageRatePlan",
    packagePlan
  );
  export default packageRatePlanModel;
  
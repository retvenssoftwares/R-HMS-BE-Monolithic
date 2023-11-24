import mongoose from "mongoose";
import db2 from "../../db/conn2.js"
const barRatePlanSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    default: "",
  },
  barRatePlanId: {
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

rateType:{
    type:String,
    default:""
},

roomType:[{
   roomTypeId: {
    type:String,
    default:"",
    },
    logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
    
}],
displayStatus:[{
    displayStatus: {
    type:String,
    default:"",
    },
    logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
}],
mealPlan:[{
    mealPlanId: {
    type:String,
    default:"",
    },
    logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
}],

ratePlanName:[{
    ratePlanName:{
        type:String,
    default:"",
    },
    logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }

}],

  shortCode: [{
    shortCode:{
        type: String,
        default: "",
    },
    logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }

  }],
  
  inclusion:[{
    inclusionPlan:[{

        inclusionId:{
            type: String,
            default: "",
        },
        inclusionName:{
            type: String,
            default: "",
        },
        inclusionType:{
            type: String,
            default: "",
        },
        postingRule:{
            type: String,
            default: "",
        },
        chargeRule:{
            type: String,
            default: "",
        },
        rate:{
            type: String,
            default: "",
        },
    }],
    logId: {
        type: String,
        default: ""
    },
       request: { type: String, default: '' },
        response: { type: String, default: '' },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        deviceType:{
            type: String,
            default: ""
        },
        ipAddress:{
            type: String,
            default: ""
        }
    

  }],

  barRates: {
    roomBaseRate: [{
      roomBaseRate: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
    }],
    mealCharge: [{
      mealCharge: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }

    }],
    inclusionCharge: [{
      inclusionCharge: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
    }],
    roundUp: [{
      roundUp: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
    }],
    extraAdultRate: [{
      extraAdultRate: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }

    }],
    extraChildRate: [{
      extraChildRate: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }

    }],
    ratePlanTotal: [{
      ratePlanTotal: {
        type: String,
        default: ""
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    deviceType:{
        type: String,
        default: ""
    },
    ipAddress:{
        type: String,
        default: ""
    }
    }]

  }

});

const ratePlan = db2.model("barrateplan", barRatePlanSchema);
export default ratePlan;

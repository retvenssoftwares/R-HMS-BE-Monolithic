import mongoose from "mongoose";
import db1 from "../db/conn.js"
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
    }
  }],


  

  inclusionTotal:[{
  inclusionTotal:{
    type: String,
    default: "",
  },
  logId: {
    type: String,
    default: ""
}
  
}],


  totalRatePlanPrice:[{
  totalRatePlanPrice:{
    type: String,
    default: "",
  },
  logId: {
    type: String,
    default: ""
}
}]

});

const ratePlan = db1.model("barrateplan", barRatePlanSchema);
export default ratePlan;

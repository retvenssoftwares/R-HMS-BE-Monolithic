import mongoose from "mongoose";

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
    modifiedDate: {
        type: String,
        default: ""
    }
}],

ratePlanName:[{
    ratePlanName:{
        type:String,
    default:"",
    },
    modifiedDate: {
        type: String,
        default: ""
    }

}],

  shortCode: {
    type: String,
    default: "",
  },
  
  Inclusion:[{
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
  }]
});

const ratePlan = mongoose.model("barrateplan", barRatePlanSchema);
export default ratePlan;

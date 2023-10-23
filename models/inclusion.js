<<<<<<< HEAD
import mongoose from "mongoose";

const inclusionSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    default: "",
  },
  inclusionId: {
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

modifiedBy: [{
  modifiedBy: {
      type: String,
      default: ''
  }
}],

modifiedOn: [{
  modifiedOn: {
      type: String,
      default: ''
  }
}],

  shortCode: {
    type: String,
    default: "",
  },
=======
import mongoose, { Mongoose, Schema , model } from "mongoose";

const inclusion = new mongoose.Schema({
    inclusionArray:[{
        inclusionId:{
            type:String,
            default:""
        },
        inclusionName:{
            type:String,
            default:""
        },
        defaultPostingRule:{
            type:String,
            default:""
        },
        defaultChargeRule:{
            type:String,
            default:""
        },
        inclusionType:{
            type:String,
            default:""
        },
        defaultPrice:{
            type:String,
            default:""
        }
       
    }, 
    {
        versionKey: false
    }],
   
})
>>>>>>> 815fdc0b61cd1324bd93f56a5cabaa183c1c1b74

  charge: [
    {
      charge: {
        type: String,
        default: "",
      },
    },
  ],

<<<<<<< HEAD
  inclusionName: [
    {
      inclusionName: {
        type: String,
        default: "",
      },
    },
  ],

  inclusionType: [
    {
      inclusionType: {
        type: String,
        default: "",
      },
    },
  ],

  chargeRule:[{
    chargeRule:{
        type: String,
        default : ''
    }
  }],
  postingRule:[{
    postingRule:{
        type: String,
        default : ''
    }
  }]
  
});

const inclusion = mongoose.model("inclusion", inclusionSchema);
export default inclusion;
=======
const inclusionDetails = new mongoose.model("inclusionDetails",inclusion)
export default inclusionDetails
>>>>>>> 815fdc0b61cd1324bd93f56a5cabaa183c1c1b74

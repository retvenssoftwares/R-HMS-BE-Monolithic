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

  charge: [
    {
      charge: {
        type: String,
        default: "",
      },
    },
  ],

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

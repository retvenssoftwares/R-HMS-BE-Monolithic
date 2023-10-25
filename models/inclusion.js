<<<<<<< HEAD
import mongoose, { Mongoose, Schema , model } from "mongoose";

const inclusionSchema = new mongoose.Schema({
  inclusionArray: [{
      inclusionId: {
          type: String,
          default: ""
      },
=======
import mongoose from "mongoose";
import db1 from "../db/conn.js"
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
>>>>>>> 606a52d3311d0341d669b8762a9d83406d49df49
      inclusionName: {
          type: String,
          default: ""
      },
      defaultPostingRule: {
          type: String,
          default: ""
      },
      defaultChargeRule: {
          type: String,
          default: ""
      },
      inclusionType: {
          type: String,
          default: ""
      },
      defaultPrice: {
          type: String,
          default: ""
      }
  }],
  charge: [{
      charge: {
          type: String,
          default: "",
      }
  }]
}, {
  versionKey: false
});

<<<<<<< HEAD
const inclusionDetails = new mongoose.model("inclusion",inclusionSchema)
export default inclusionDetails
=======
const inclusion = db1.model("inclusion", inclusionSchema);
export default inclusion;
>>>>>>> 606a52d3311d0341d669b8762a9d83406d49df49

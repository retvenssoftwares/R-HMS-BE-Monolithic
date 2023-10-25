import mongoose, { Mongoose, Schema , model } from "mongoose";

const inclusionSchema = new mongoose.Schema({
  inclusionArray: [{
      inclusionId: {
          type: String,
          default: ""
      },
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

const inclusionDetails = new mongoose.model("inclusion",inclusionSchema)
export default inclusionDetails

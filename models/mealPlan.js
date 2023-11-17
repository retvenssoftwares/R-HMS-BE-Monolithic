import mongoose from "mongoose";
import db1 from "../db/conn.js";
const mealSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    default: "",
  },

  mealPlanId: {
    type: String,
    default: "",
  },

  shortCode: [
    {
      shortCode: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
    },
  ],

  mealPlanName: [
    {
      mealPlanName: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
    },
  ],

  chargesPerOccupancy: [
    {
      chargesPerOccupancy: {
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: "",
      },
    },
  ],
  createdBy: {
    type: String,
    default: "",
  },

  createdOn: {
    type: String,
    default: "",
  },

  modifiedBy: [
    {
      modifiedBy: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
    },
  ],

  modifiedOn: [
    {
      modifiedOn: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" },
    },
  ],
});

const mealPlan = db1.model("mealPlan", mealSchema);

export default mealPlan;

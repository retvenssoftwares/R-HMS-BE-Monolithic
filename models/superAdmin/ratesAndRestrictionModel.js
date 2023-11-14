import { mongoose } from "mongoose";
import db1 from "../../db/conn.js";
const ratesAndRestriction = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  createdOn: {
    type: String,
    default: "",
  },
});
const ratesAndRestrictions = db1.model("ratesAndRestrictionList", ratesAndRestriction);
export default ratesAndRestrictions;

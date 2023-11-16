import { Schema, model } from "mongoose";
import db1 from "../db/conn.js"

const reservationTypeSchema = Schema({
  propertyId: { type: String, default: "", unique: false },
  reservationTypeId: { type: String, default: "" },
  displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],
  createdBy: { type: String, default: "" },
  createdOn: { type: String, default: "" },
  reservationName: [
    {
      reservationName: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" }
    },
  ],
  status: [
    {
      status: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" }
    },
  ],
  modifiedBy: [
    {
      modifiedBy: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" }
    },
  ],

  modifiedOn: [
    {
      modifiedOn: {
        type: String,
        default: "",
      },
      logId: { type: String, default: "" }
    },
  ],
});

const reservationModel = db1.model("reservationType", reservationTypeSchema);
export default reservationModel;

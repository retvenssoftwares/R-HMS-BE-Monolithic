import { Schema, model } from "mongoose";

const reservationTypeSchema = Schema({
  propertyId: { type: String, default: "", unique: false },
  reservationTypeId: { type: String, default: "" },
  dateUTC: {
    type: String,
  },
  dateLocal: {
    type: String,
  },
  createdBy: { type: String, default: "" },
  createdOn: { type: String, default: "" },

  reservationName: [
    {
      reservationName: {
        type: String,
        default: "",
      },
    },
  ],
  status: [
    {
      status: {
        type: String,
        default: "",
      },
    },
  ],
  modifiedBy: [
    {
      modifiedBy: {
        type: String,
        default: "",
      },
    },
  ],

  modifiedOn: [
    {
      modifiedOn: {
        type: String,
        default: "",
      },
    },
  ],
});

const reservationModel = model("reservationType", reservationTypeSchema);
export default reservationModel;

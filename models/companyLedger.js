import mongoose, { Schema } from "mongoose";
import db1 from "../db/conn.js";

const company = new mongoose.Schema({
  companyId: {
    type: String,
    default: "",
  },

  propertyId: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  openingBalance: [
    {
      openingBalance: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
    },
  ],

  creditLimit: [
    {
      creditLimit: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
    },
  ],

  totalBalance: [
    {
      totalBalance: {
        type: Number,
      },

      logId: {
        type: String,
        default: "",
      },
    },
  ],

  ledger: [
    {
      particular: {
        type: String,
        default: "",
      },

      date: Date,

      voucher: {
        voucherNo: {
          type: String,
          default: "",
        },

        vocherLink: {
          type: String,
          default: "",
        },
      },

      cr: {
        type: String,
        default : "0"
      },

      dr : {
        type: String,
        default:""
      },

      balance : {
        type: String,
        required : true
      }
    },
  ],
},{
    versionKey:false
});

const comapnyLedger = db1.model("companyLedger", company);
export default comapnyLedger;

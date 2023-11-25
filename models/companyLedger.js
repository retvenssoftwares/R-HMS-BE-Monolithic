import mongoose, { Schema } from "mongoose"
import db1 from "../db/conn.js"

const company = new mongoose.Schema({

    companyId: {
        type: String,
        default: ""
    },

    propertyId: {
        type: String,
        default: ""
    },

    date:{
        type: String,
        default: ""
    },

    openingBalance : [{
        openingBalance : {
            type: String,
            default: ""
        },

        logId:{
            type: String,
            default: ""
        }
    }],

    creditLimit: [{

        creditLimit: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    totalBalance: [{
        totalBalance: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],


    ledger: [{
        ledger: [{

            particular: {
                type: String,
                default: ""
            },

            voucher: [{
                voucherNo: {
                    type: String,
                    default: ""
                },

                vocherLink: {
                    type: String,
                    default: ""
                }
            }],

            amount : {
                type:String,
                default:""
            },


        }],

        


        logId: {
            type: String,
            default: ""
        }

    }],

})


const comapnyLedger = db1.model("companyLedger", company)
export default comapnyLedger
import mongoose, { Schema } from "mongoose"
import db1 from "../db/conn.js"

const company = new mongoose.Schema({

    companyId: {
        type: String,
        default: ""
    },

    hotelCode: {
        type: String,
        default: ""
    },

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

            createdOn: {
                type: String,
                default: ""
            },

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


        }],

        amount: [{
            credit: {
                type: String,
                default: ""
            },

            debit: {
                type: String,
                default: ""
            }
        }],


        logId: {
            type: String,
            default: ""
        }

    }],

})


const comapnyLedger = db1.model("companyLedger", company)
export default comapnyLedger
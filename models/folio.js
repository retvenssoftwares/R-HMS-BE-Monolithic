import mongoose from "mongoose";
import db1 from "../db/conn.js";

const folioManagement = new mongoose.Schema({

    folioNo: {
        type: String,
        default: ""
    },

    propertyId: {
        type: String,
        default: ""
    },

    reservationNumber: {
        type: String,
        default: ""
    },

    date: {
        type: Date,
        default: Date.now,
    },


    totalBalance: {
        type: Number
    },

    isTransfered: {
        type: String,
        default: "false"
    },

    isMasterFolio : {
        type: String,
        default: "false"
    },

    isSettleFolio :{
        type: String,
        default: "false"
    },

    isClosed:{
        type: String,
        default: "false"
    },
    
    reservationIds:{
        type: String,
        default: ""
    },

    billingPreferences :[{
        billTo :{
            type: String,
            default: ""
        },

        nameOnFolio:{
            type: String,
            default: ""
        },

        gstinNo:{
            type: String,
            default: ""
        },

        logId:{
            type: String,
            default: ""
        }
    }],

    transferedFolio: {
        type: String,
        default: ""
    },

    document : [{
        fileName : {
            type: String,
            default: ""
        },

        remark:{
            type: String,
            default: ""
        },


        logId:{
            type: String,
            default: ""
        }
    }],

    // voidStatus:{
    //     type: String,
    //     default: "false"
    // },
   

    folioRecords: [{

        date: {
            type: Date,
            default: Date.now,
        },

        particular: {
            type: String,
            default: ""
        },

        refNo: {
            type: String,
            default: ""
        },

        user: {
            type: String,
            default: ""
        },

        /// discount 
        discountType: {
            type: String,
            default: ""
        },

        discountPercentage: {
            type: String,
            default: ""
        },

        discountAmount: {
            type: String,
            default: ""
        },

        //adjustment

        adjustmentFor: {
            type: String,
            default: ""
        },

        adjustmentAmount: {
            type: String,
            default: ""
        },


        //payment
        paymentType: {
            type: String,
            default: ""
        },

        paymentMethod: {
            type: String,
            default: ""
        },

        paymentAmount: {
            type: String,
            default: ""
        },

        //charge
        chagreType: {
            type: String,
            default: ""
        },

        chargeRule: {
            type: String,
            default: ""
        },

        rate: {
            type: String,
            default: ""
        },

        totalCharges: {
            type: String,
            default: ""
        },

        taxArray:[{
            taxId:{
                type: String,
                default: ""
            },

            logId:{
                type: String,
                default: ""
            }
        }],

        quantity: {
            type: String,
            default: ""
        },

        narration: {
            type: String,
            default: ""
        },

        voidStatus:{
            type: String,
            default: "false"
        },

        reasons:{
            type: String,
            default: "false"
        },

        logId: {
            type: String,
            default: ""
        }


    }],




})


const folio = db1.model("folio", folioManagement)
export default folio
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



    // charge: [{

    //     charge: [{

    //         // referenceNumber : {
    //         //     type:String,
    //         //     default : ""
    //         // },

    //         // particular:{
    //         //     type:String,
    //         //     default : ""
    //         // },

    //         chagreType: {
    //             type: String,
    //             default: ""
    //         },

    //         chargeRule: {
    //             type: String,
    //             default: ""
    //         },

    //         rate: {
    //             type: String,
    //             default: ""
    //         },

    //         totalCharges: {
    //             type: String,
    //             default: ""
    //         },

    //         quantity: {
    //             type: String,
    //             default: ""
    //         },

    //         user: {
    //             type: String,
    //             default: ""
    //         },

    //         Narration: {
    //             type: String,
    //             default: ""
    //         },

    //     }],

    //     logId: {
    //         type: String,
    //         default: ""
    //     }

    // }],

    // payment: [{
    //     payment: [{

    //         // referenceNumber : {
    //         //     type:String,
    //         //     default : ""
    //         // },

    //         // particular:{
    //         //     type:String,
    //         //     default : ""
    //         // },

    //         paymentType: {
    //             type: String,
    //             default: ""
    //         },


    //         paymentMethod: {
    //             type: String,
    //             default: ""
    //         },

    //         amount: {
    //             type: String,
    //             default: ""
    //         },

    //         narration: {
    //             type: String,
    //             default: ""
    //         },

    //     }],

    //     logId: {
    //         type: String,
    //         default: ""
    //     }
    // }],

    // // adjustment: [{
    // //     adjustment: [{

    // //         adjustmentFor: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //         amount: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //         narration: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //     }],

    // //     logId: {
    // //         type: String,
    // //         default: ""
    // //     }
    // // }],


    // // discount: [{
    // //     discount: [{

    // //         discountType: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //         dsicount: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //         amount: {
    // //             type: String,
    // //             default: ""
    // //         },

    // //         narration: {
    // //             type: String,
    // //             default: ""
    // //         }
    // //     }],

    // //     logId: {
    // //         type: String,
    // //         default: ""
    // //     }
    // // }],

    folioRecords: [{

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

            dsicount: {
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

            quantity: {
                type: String,
                default: ""
            },

            narration: {
                type: String,
                default: ""
            },

            balance: {
                type: String,
                default: ""
            },

        }]

    }]

})


const folio = db1.model("folio", folioManagement)
export default folio
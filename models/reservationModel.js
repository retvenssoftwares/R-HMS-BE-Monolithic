import mongoose from "mongoose";
import db1 from "../db/conn.js"
const booking = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ""
    },

    guestId: [{
        guestId: {
            type: String,
            default: ""
        }
    }],

    checkInDate: [{
        checkInDate: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    checkOutDate: [{
        checkOutDate: {
            type: String,
            default: ""
        },

        logId: {

            type: String,
            default: ""

        }
    }],


    nightCount: [{
        nightCount: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],


    bookingId: {
        type: String,
        default: ""
    },



    createdBy: [{
        createdBy: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
        }

    }],


    createdOn: [{
        createdOn: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    // rateType: [{
    //     //change to rateTypeId
    //     rateTypeId: {
    //         type: String,
    //         default: ""
    //     },

    //     logId: {
    //         type: String,
    //         default: ""
    //     }

    // }],


    // company Reservation
    // change to companyId
    companyReservation: [{
        companyId: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],


    // bar reservation
    barRateReservation: [{
        barRateReservation: [{
            bookingTypeId: {
                type: String,
                default: ""
            },

            bookingSourceId: {
                type: String,
                default: ""
            },

        }],

        logId: {
            type: String,
            default: ""
        }
    }],


    // discount reservation
    discountReservation: [{
        // cahnge to id
        discountReservation: [{
            bookingTypeId: {
                type: String,
                default: ""
            },

            // changed to discountPlanId

            discountPlanId: {
                type: String,
                default: ""
            },

            // changr to id
            discountTypeId: {
                type: String,
                default: ""
            },

            discountAmount: {
                type: String,
                default: ""
            },


        }],

        logId: {
            type: String,
            default: ""
        }

    }],



    roomDetails: [{

        roomDetails: [{

            roomTypeId: {
                type: String,
                default: ""
            },


            // change to id
            ratePlanId: {
                type: String,
                default: ""
            },




            adults: {
                type: String,
                default: ""
            },




            childs: {
                type: String,
                default: ""
            },




            charge: {
                type: String,
                default: ""
            },




            extraAdult: {
                type: String,
                default: ""
            },



            // this fileds could be used in quick reservation 

            rate: {
                type: String,
                default: ""
            },


            //change to id
            extraInclusionId: {
                type: String,
                default: ""
            },

        }],

        logId: {
            type: String,
            default: ""
        }


    }],



    remark: [{
        remark: [{
            specialRemark: {
                type: String,
                default: ""
            },

       
            internalNote: {
                type: String,
                default: ""
            },

        }],

        logId: {
            type: String,
            default: ""
        }


    }],




    //quickRemark
    quickRemark: [{
        quickRemark: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    //Internal note for quickReservation
    quickInternalNote: [{
        quickInternalNote: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    //name will be changed to reservationRate
    reservationRate: [{
        roomCharges: [{
            roomCharges: {
                type: String,
                default: ""
            },

            extras: {
                type: String,
                default: ""
            },

    
            taxes: {
                type: String,
                default: ""
            },
     
            from: {
                type: String,
                default: ""
            },

  
            to: {
                type: String,
                default: ""
            },

            grandTotal: {
                type: String,
                default: ""
            },

        }],

        logId: {
            type: String,
            default: ""
        }

    }],



    applyDiscount: [{
        applyDiscount: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],


    paymentDetails: [{
        paymentDetails: [{
            billTo: {
                type: String,
                default: ""
            },
     

            paymentNote: {
                type: String,
                default: ""
            },
        }],


        logId: {
            type: String,
            default: ""
        }


    }],

    reservationNumber: {
        type: String,
        default: ""
    },

    reservationIds: [{
        type: String,
        default: ""
    }],


    isQuickReseration: {
        type: String,
        default: "false"
    },

    isGroupBooking: {
        type: String,
        default: "false"
    },

    cardDetails: [{
        cardDetails: [{
            nameOnCard: {
                type: String,
                default: ""
            },
            cardNumber: {
                type: String,
                default: ""
            },

            cvv: {
                type: String,
                default: ""
            },

            expiryDate: {
                type: String,
                default: ""
            }
        }],

        logId: {
            type: String,
            default: ""
        }
    }],


    createTask: [{
        createTask: [{
            taskTitle: {
                type: String,
                default: ""
            },

          
    
            schedule: {
                type: String,
                default: ""
            },

        

            description: {
                type: String,
                default: ""
            },

           
        }],

        logId: {
            type: String,
            default: ""
        }

    }]
},

    {
        versionKey: false
    }
)

const bookingModel = db1.model("reservationDetails", booking)

export default bookingModel

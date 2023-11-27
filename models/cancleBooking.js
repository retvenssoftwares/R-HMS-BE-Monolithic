import mongoose, { mongo } from "mongoose";
import db1 from "../db/conn.js";

const confirmBookingDetails = new mongoose.Schema({
    guestId: {
        type: String,
        default: ""
    },

    guestName: [{

        guestName: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    salutation: [
        {
            salutation: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],


    phoneNumber: [
        {
            phoneNumber: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    emailAddress: [
        {
            emailAddress: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    addressLine1: [
        {
            addressLine1: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    addressLine2: [
        {
            addressLine2: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    country: [
        {
            country: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    state: [
        {
            state: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

    city: [
        {
            city: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],


    pinCode: [
        {
            pinCode: {
                type: String,
                default: "",
            },

            logId: {
                type: String,
                default: "",
            },
        },
    ],

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


    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

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


    reservationId: {
        type: String,
        default: ""
    },

    propertyId: {
        type: String,
        default: ""
    },

    bookingId: {
        type: String,
        default: ""
    },

    roomTypeId: [{

        roomTypeId: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    bookingTime: {
        type: String,
        default: ""
    },

    ratePlanId: [{

        ratePlanId: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

    ratePlanName: [{
        ratePlanName: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    extraAdultRate: [{
        extraAdultRate: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
        }

    }],

    extraChildRate: [{
        extraChildRate: {
            type: String,
            default: ""
        },
        logId: {
            type: String,
            default: ""
        }
    }],


    adults: [{
        adults: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    childs: [{
        childs: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    charge: [{
        charge: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],




    rateTypeId: {
        type: String,
        default: ""
    },
    

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

    barRateReservation: [{
        barRateReservation: [{
            bookingTypeId: {
                type: String,
                default: ""
            },

            bookingSourceId: {
                type: String,
                default: ""
            }
        }],

        logId: {
            type: String,
            default: ""
        }
    }],

    roomTypeName: [{

        roomTypeName: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],



    remark: [{
        remark: {
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }
    }],

    internalNote:[{
        internalNote :{
            type: String,
            default: ""
        },

        logId: {
            type: String,
            default: ""
        }

    }],

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

    baseRates: [{

        baseRates: [{

            date: {
                type: String,
                default: ""
            },
            baseRate: {
                type: String,
                default: ""
            },

            extraAdultRate: {
                type: String,
                default: ""
            },

            extraChildRate: {
                type: String,
                default: ""
            },

        }],

        logId: {
            type: String,
            default: ""
        }



    }],

    extraInclusionId: [{
        type: String,
        default: ""
    }],

    inventory: {
        type: Number,
        default: 0
    },

    reservationNumber: {
        type: String,
        default: ""
    },

    companyId: {
        type: String,
        default: ""
    },


    c_form: [
        {
            c_form: [
                {
                    address: {
                        type: String,
                        default: "",
                    },
                    state: {
                        type: String,
                        default: "",
                    },
                    city: {
                        type: String,
                        default: "",
                    },
                    pinCode: {
                        type: String,
                        default: "",
                    },
                    arrivedFrom: {
                        type: String,
                        default: "",
                    },
                    dateOfArrival: {
                        type: String,
                        default: "",
                    },
                    passportNo: {
                        type: String,
                        default: "",
                    },
                    placeOfIssue: {
                        type: String,
                        default: "",
                    },
                    issueDate: {
                        type: String,
                        default: "",
                    },
                    expiryDate: {
                        type: String,
                        default: "",
                    },
                    visaNo: {
                        type: String,
                        default: "",
                    },
                    visaType: {
                        type: String,
                        default: "",
                    },
                    placeOfIssue: {
                        type: String,
                        default: "",
                    },
                    issueDate: {
                        type: String,
                        default: "",
                    },
                    expiryDate: {
                        type: String,
                        default: "",
                    },
                    whetherEmployedInIndia: {
                        type: String,
                        default: "",
                    },
                    guardianName: {
                        type: String,
                        default: "",
                    },
                    age: {
                        type: String,
                        default: "",
                    },
                    purposeOfVisit: {
                        type: String,
                        default: "",
                    },
                    nextDestinationPlace: {
                        type: String,
                        default: "",
                    },
                    nextDestinationState: {
                        type: String,
                        default: "",
                    },
                    nextDestinationcity: {
                        type: String,
                        default: "",
                    },
                    contactNo: {
                        type: String,
                        default: "",
                    },
                    parmanentResidentContactNo: {
                        type: String,
                        default: "",
                    },
                    mobileNo: {
                        type: String,
                        default: "",
                    },
                    parmanentResidentMobileNo: {
                        type: String,
                        default: "",
                    },
                    remark: {
                        type: String,
                        default: "",
                    },
                },
            ],
            logId: {
                type: String,
                default: "",
            },
        },
    ],

    employeeId:{
        type:String,
        default:""
    },

    roomNo:{
        type:String,
        default:""
    },

})

const bookingDetails = db1.model("ConfirmBookingDetails",confirmBookingDetails)
export default bookingDetails
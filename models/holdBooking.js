import mongoose from "mongoose";
import db1 from "../db/conn.js"
const holdDetails = new mongoose.Schema({

    guestId: {
        type: String,
        default: ""
    },

    guestName: {
        type: String,
        default: ""
    },

    salutation: {
        type: String,
        default: ""
    },

    phoneNumber: {
        type: String,
        default: ""
    },

    emailAddress: {
        type: String,
        default: ""
    },


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

    roomTypeId: {
        type: String,
        default: ""
    },

    checkInDate: {
        type: String,
        default: ""
    },

    checkOutDate: {
        type: String,
        default: ""
    },

    bookingTime: {
        type: String,
        default: ""
    },

    ratePlanId: {
        type: String,
        default: ""
    },
    ratePlanName: {
        type: String,
        default: ""
    },

    extraAdultRate : {
        type: String,
        default: ""
    },

    extraChildRate : {
        type: String,
        default: ""
    },


    adults:{
        type: String,
        default: ""
    },

    childs:{
        type: String,
        default: ""
    },

    charge:{
        type: String,
        default: ""
    },

    rateTypeId: {
        type: String,
        default: ""
    },

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
        }]
    }],

    roomTypeName: {
        type: String,
        default: ""
    },

    remark: {
        type: String,
        default: ""
    },

    internalNote: {
        type: String,
        default: ""
    },

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

        }]


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

    companyId : {
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

    //     guestId: {
    //         type: String,
    //         default: "",
    //     },

    //     salutation: [
    //         {
    //             salutation: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     guestProfile: [
    //         {
    //             guestProfile: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     guestName: [
    //         {
    //             guestName: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     phoneNumber: [
    //         {
    //             phoneNumber: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     emailAddress: [
    //         {
    //             emailAddress: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     addressLine1: [
    //         {
    //             addressLine1: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     addressLine2: [
    //         {
    //             addressLine2: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     country: [
    //         {
    //             country: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     state: [
    //         {
    //             state: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     city: [
    //         {
    //             city: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     pinCode: [
    //         {
    //             pinCode: {
    //                 type: String,
    //                 default: "",
    //             },

    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],


    //     /// booking Details

    //     bookingId: {
    //         type: String,
    //         default: ""
    //     },


    //     roomTypeId: {
    //         type: String,
    //         default: ""
    //     },

    //     checkInDate: [{
    //         checkInDate: {
    //             type: String,
    //             default: ""
    //         },

    //         logId: {
    //             type: String,
    //             default: ""
    //         }


    //     }],

    //     checkOutDate: [{

    //         checkOutDate: {
    //             type: String,
    //             default: ""
    //         },

    //         logId: {
    //             type: String,
    //             default: ""
    //         }

    //     }],

    //     bookingTime: [{
    //         bookingTime: {
    //             type: String,
    //             default: ""
    //         },

    //         logId: {
    //             type: String,
    //             default: ""
    //         }

    //     }],

    //     inventory: {
    //         type: Number,
    //         default: 0
    //     },

    //     reservationNumber: {
    //         type: String,
    //         default: ""
    //     },


    //     otherInfo: [
    //         {
    //             identityProfile: {
    //                 type: String,
    //                 default: "",
    //             },
    //             idNumber: {
    //                 type: String,
    //                 default: "",
    //             },
    //             idType: {
    //                 type: String,
    //                 default: "",
    //             },
    //             issuingCountry: {
    //                 type: String,
    //                 default: "",
    //             },
    //             issuingCity: {
    //                 type: String,
    //                 default: "",
    //             },
    //             expiryDate: {
    //                 type: String,
    //                 default: "",
    //             },
    //             paymentMethodId: {
    //                 type: String,
    //                 default: "",
    //             },
    //             directBillingAccountId: {
    //                 type: String,
    //                 default: "",
    //             },
    //             birthDate: {
    //                 type: String,
    //                 default: "",
    //             },
    //             birthCountry: {
    //                 type: String,
    //                 default: "",
    //             },
    //             nationality: {
    //                 type: String,
    //                 default: "",
    //             },
    //             vipStatus: {
    //                 type: String,
    //                 default: "",
    //             },
    //             spouseBirthDate: {
    //                 type: String,
    //                 default: "",
    //             },
    //             weddingAnniversary: {
    //                 type: String,
    //                 default: "",
    //             },
    //             registrationNo: {
    //                 type: String,
    //                 default: "",
    //             },
    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],

    //     c_form: [
    //         {
    //             c_form: [
    //                 {
    //                     address: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     state: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     city: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     pinCode: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     arrivedFrom: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     dateOfArrival: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     passportNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     placeOfIssue: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     issueDate: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     expiryDate: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     visaNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     visaType: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     placeOfIssue: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     issueDate: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     expiryDate: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     whetherEmployedInIndia: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     guardianName: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     age: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     purposeOfVisit: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     nextDestinationPlace: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     nextDestinationState: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     nextDestinationcity: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     contactNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     parmanentResidentContactNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     mobileNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     parmanentResidentMobileNo: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                     remark: {
    //                         type: String,
    //                         default: "",
    //                     },
    //                 },
    //             ],
    //             logId: {
    //                 type: String,
    //                 default: "",
    //             },
    //         },
    //     ],
});



const holdData = db1.model("hold", holdDetails)
export default holdData

import { Schema, model } from 'mongoose';
import db1 from "../db/conn.js"
const propertySchema = new Schema({
    userId: {
        default: "",
        type: String
    },
    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],
    propertyId: {
        default: "",
        type: String
    },
    createdOn: {
        type: String,
        default: ""
    },
    createdBy: {
        type: String,
        default: ""
    },

    OTAs: [{
        otaId: { type: String, default: '' },
        activatedOn: { type: String, default: '' }
    }],

    country: {
        default: "",
        type: String
    },
    propertyAddress1: [{
        propertyAddress1: {
            default: "",
            type: String
        },

        logId: { type: String, default: '' }
    }],

    propertyAddress2: [{
        propertyAddress2: {
            default: "",
            type: String
        },
        logId: { type: String, default: '' }
    }],
    postCode: [{
        postCode: {
            default: "",
            type: String
        },
        logId: { type: String, default: '' }
    }],

    city: [{
        city: {
            default: "",
            type: String
        },
        logId: { type: String, default: '' }
    }],
    state: [{
        state: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
    location: [{

        latitude: {
            default: "",
            type: String,

        },
        longitude: {
            default: "",
            type: String
        },
        logId: { type: String, default: '' }
    }],

    propertyName: [{
        propertyName: {
            default: "",
            type: String,
        },
        logId: { type: String, default: '' }
    }],

    rating: [{
        rating: {
            default: "",
            type: String,
        },
        logId: { type: String, default: '' }

    }],


    propertyManagement: {
        default: "",
        type: String,
    },
    management: {
        default: "",
        type: String,
    },
    amenities: [{
        amenities: [{
            amenityId: {
                default: "",
                type: String
            },
        }],
        logId: { type: String, default: '' }
    }],

    checkInTime: [{
        checkInFrom: {
            default: "",
            type: String
        },
        checkInUntil: {
            default: "",
            type: String
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    checkOutTime: [{
        checkOutFrom: {
            default: "",
            type: String
        },
        checkOutUntil: {
            default: "",
            type: String
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],


    coverPhoto: [{
        coverPhotoId: {
            default: "",
            type: String,

        },
        coverPhoto: {
            default: "",
            type: String,
        },
        modifiedDate: {
            type: String,
            default: ""
        },

    }],

    hotelLogo: [{
        hotelLogoId: {
            default: "",
            type: String,
        },
        hotelLogo: {
            default: "",
            type: String,
        },
        logId: { type: String, default: '' }

    }],

    roomType: [{
        roomTypeId: {
            default: "",
            type: String
        }
    }],

    propertyEmail: [{
        propertyEmail: {
            type: String,
            default: ''
        },
        logId: { type: String, default: '' }
    }],
    hotelRCode: {
        type: String,
        default: ''
    },
    propertyChainName:[{
        propertyChainName: {
            type: String,
            default: ""
        },
        logId:{ 
            type: String,
             default:""
            }
        }],
        propertyType:[{
            propertyType: {
                type: String,
                default: ""
            },
            logId:{ 
                type: String,
                 default:""
                }
        }],
        websiteUrl:[{
            websiteUrl: {
                type: String,
                default: ""
            },
            logId:{
                type: String,
                default:""
            }
        }],
        baseCurrency:[{
            baseCurrency: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:""
            }
        }],
        starCategory:[{
            starCategory: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:""
            }
        }],
        phone:[{
            phone: {
                type: String,
                default: ""
            },
            logId:{
                type: String,
                default:''
            }
        }],
        reservationPhone:[{
            reservationPhone: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:''
            }
        }],
        registrationNumber:[{
            registrationNumber: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:''
            }
        }],
        roomsInProperty:[{
            roomsInProperty: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:''
            }
        }],
        taxName:[{
            taxName: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:''
            }
        }],
        ratePercent:[{
            ratePercent: {
                type: String,
                default: ''
            },
            logId:{
                type: String,
                default:''
            }
        }],
   propertyRating:[{
    propertyRating: {
        type: String,
        default: ''
    },
    logId:{
        type: String,
        default:''
    }
   }],
    propertyDescription: [{
        propertyDescription: {
            type: String,
            default: ''
        },
        logId: { type: String, default: '' }
    }]

})

const property = db1.model('property', propertySchema);
export default property;
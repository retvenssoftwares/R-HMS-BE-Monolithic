
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
    propertyChainName: {
        type: String,
        default: ""
    },
    propertyType: {
        type: String,
        default: ""
    },
    websiteUrl: {
        type: String,
        default: ""
    },
    baseCurrency: {
        type: String,
        default: ''
    },
    starCategory: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ""
    },
    reservationPhone: {
        type: String,
        default: ''
    },
    registrationNumber: {
        type: String,
        default: ''
    },
    roomsInProperty: {
        type: String,
        default: ''
    },
    taxName: {
        type: String,
        default: ''
    },
    ratePercent: {
        type: String,
        default: ''
    },
    propertyRating: {
        type: String,
        default: ''
    },
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
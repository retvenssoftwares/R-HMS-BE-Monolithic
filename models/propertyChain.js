import { Schema, model } from 'mongoose';

const propertyChainSchema = new Schema({
    userId: {
        default: "",
        type: String
    },
    propertyChainId: {
        default: "",
        type: String
    },
    dateUTC: {
        type: String
    },
    dateLocal: {
        type: String
    },

    numberOfProperties: [{
        numberOfProperties: {
            default: "",
            type: String
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],


     city: [{
        city: {
            default: "",
            type: String
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],
    state: [{
        state: { type: String, default: '' },
        modifiedDate: { type: String, default: '' }
    }],
   

    propertyChainName: [{
        propertyChainName: {
            default: "",
            type: String,
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
        modifiedDate: {
            type: String,
            default: ""
        },

    }],   

    
    hotelRCode: {
        type: String,
        default: ''
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
    propertyTypeName: {
        type: String,
        default: ""
    },
   
})

const propertyChainModel = model('propertychain', propertyChainSchema);
export default propertyChainModel;
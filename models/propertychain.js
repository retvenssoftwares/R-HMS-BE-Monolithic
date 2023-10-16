import mongoose from 'mongoose';

const propertychainSchema = new mongoose.Schema({

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

  propertyType: {
    default: "",
    type: String
  },

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
  propertyName: [{
    propertyName: {
      default: "",
      type: String,
    },
    modifiedDate: {
      type: String,
      default: ""
    }
  }],
  websiteUrl: {
    type: String,
    default: ""
  },
  baseCurrency: {
    type: String,
    default: ''
  },

})

const propertychain = mongoose.model('propertychain', propertychainSchema);

export default propertychain;
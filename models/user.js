// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  firstName: {
    type: String,
    required: false
  },
  role: [{
    role: {
      type: String,
      required: false
    },
    modifiedDate: String
  }],
  lastName: {
    type: String,
    required: false,
  },
  designation: [
    {
      designation: {
        type: String,
        required: false
      },
      modifiedDate: String
    }],
  phoneNumber: [{
    phoneNumber: {
      type: String,
      required: false
    },
    modifiedDate: String
  }],
  username: [{
    username: { type: String, default: '' },
    modifiedDate: String
  }],
  hotelRcode: {
    type: String,
    required: false,
    default: ''
  },
  authCode: {
    type: String
  },
  email: {
    type: String
  },
  link: {
    type: String,
    default: ''
  },
  propertyTypeSOC: { type: String, default: '' }, //single or chain
  singlePropertyDetails: [{
    userId: {
      default: "",
      type: String
    },
    propertyId: {
      default: "",
      type: String
    },
    dateUTC: {
      type: String
    },
    dateLocal: {
      type: String
    },
    country: {
      default: "",
      type: String
    },
    propertyAddress1: [{
      propertyAddress1: {
        default: "",
        type: String
      },
      modifiedDate: {
        type: String,
        default: ""
      }
    }],
    postCode: [{
      postCode: {
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
    location: [{

      latitude: {
        default: "",
        type: String,

      },
      longitude: {
        default: "",
        type: String
      },
      modifiedDate: {
        type: String,
        default: ""
      }
    }],

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
      modifiedDate: {
        type: String,
        default: ""
      },

    }],


    propertyEmail: [{
      propertyEmail: {
        type: String,
        default: ''
      }
    }],
    hotelRCode: {
      type: String,
      default: ''
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
    starCategory: {
      type: String,
      default: ''
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    reservationNumber: {
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
    propertyType: { type: String, default: '' },
    propertyRating: {
      type: String,
      default: ''
    },
    propertyDescription: {
      type: String,
      default: ''
    }
  }],
  password: [{
    password: {
      type: String
    },
    modifiedDate: String
  }],


  ///// multiple 
  multipleData: [{
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

  }],

  verificationStatus: {
     type: String,
     default: 'false'
  },
},
  {
    versionKey: false
  });



const User = mongoose.model('User', userSchema);

export default User;
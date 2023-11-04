import mongoose from "mongoose";
import db1 from "../db/conn.js"

const guestDetails = new mongoose.Schema({
    guestId :{
        type:String,
        default:""
    },

    // bookingId:{
    //     type:String,
    //     default:""
    // },

    salutation:[{
        salutation:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    guestProfile :[{
        guestProfile:{
            type:String,
            default:""    
        },

        logId:{
            type:String,
            default:""
        }
    }],
    
    guestName:[{
       guestName:{
        type: String,
        default : ""
       },

       logId:{
        type:String,
        default:""
       }
    }],

    phoneNumber:[{

        phoneNumber :{
            type:String,
            default:""
        },

         logId:{
            type:String,
            default:""
         }
        
    }],

    emailAddress:[{
        emailAddress:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    addressLine1:[{
        addressLine1 :{
            type:String,
             default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    addressLine2:[{
        addressLine2:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    country:[{
        country:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    state:[{
        state:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    city:[{
        city:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

    pinCode:[{
        pinCode:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],


    otherInfo:[{
        identityProfile:{
            type:String,
            default:""
        },
        idNumber:{
            type:String,
            default:""
        },
        idType:{
            type:String,
            default:""
        },
        issuingCountry:{
            type:String,
            default:""
        },
        issuingCity:{
            type:String,
            default:""
        },
        expiryDate:{
            type:String,
            default:""
        },
        paymentMethodId:{
            type:String,
            default:""
        },
        driectBillingAccountId:{
            type:String,
            default:""
        },
        birthDate:{
            type:String,
            default:""
        },
        birthCountry:{
            type:String,
            default:""
        },
        nationality:{
            type:String,
            default:""
        },
        vipStatus:{
            type:String,
            default:""
        },
        spouseBirthDate:{
            type:String,
            default:""
        },
        weddingAnniversary:{
            type:String,
            default:""
        },
        registrationNo:{
            type:String,
            default:""
        },
        logId:{
            type:String,
            default:""
        }
    }]
})


const guestCollections = db1.model("guestData" ,guestDetails)
export default guestCollections
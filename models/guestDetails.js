import mongoose from "mongoose";


const guestDetails = new mongoose.Schema({
    guestId :{
        type:String,
        default:""
    },

    bookingId:{
        type:String,
        default:""
    },

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
        
    }]
})
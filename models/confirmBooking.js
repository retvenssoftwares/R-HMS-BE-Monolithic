import mongoose, { mongo } from "mongoose";
import db1 from "../db/conn.js";

const confirmBookingDetails = new mongoose.Schema({
    bookingId :{
        type:String,
        default:""
    },

    guestId:{
        type:String,
        default:""
    },

    propertyId:{
        type:String,
        default:""
    },

    salutation :{
        type:String,
        default:""
    },

    guestName:{
        type:String,
        default:""
    },

    checkInDate:{
        type:String,
        default:""
    },

    checkOutDate:{
        type:String,
        default:""
    },

    phoneNumber:{
        type:String,
        default:""
    },

    emailAddress:{
        type:String,
        default:""
    },

    reservationNo :{
        type:String,
        default:""
    },

    roomDetails :[{
        roomTypeId :[{
            roomTypeId:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
        ratePlan:[{
            // change to id
            ratePlanId :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        

        adults:[{
            adults :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],

        childs:[{
            childs :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
    
        charge :[{
            charge:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }            

        }],

        extraAdult:[{
            extraAdult :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        

        extraInclusion:[{
            //change to id
            extraInclusionId :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
       
    }],

})

const bookingDetails = db1.model("ConfirmBookingDetails",confirmBookingDetails)
export default bookingDetails
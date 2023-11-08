import mongoose  from "mongoose";
import db1 from "../db/conn.js"
const booking = new mongoose.Schema({
    
    propertyId:{
        type:String,
        default:""
    },

    guestId :[{
        guestId:{
            type:String,
            default:""
        }
    }],

    checkIn :[{
       checkIn:{
        type:String,
        default:""
       },

       logId:{
        type:String,
        default:""
       }

    }],

    checkOut:[{
        checkOut :{
            type:String,
            default:""
        },

        logId:{
            
                type:String,
                default:""
            
        }
    }],
    

    nightCount:[{
        nightCount :{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    }],

   
        bookingId :{
            type:String,
            default:""
        },

        

    createdBy:[{
        createdBy:{
            type:String,
            default:""
        },
        logId:{
            type:String,
            default:""
        }

    }],
   

    createdOn:[{
        createdOn:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }

    }],

    rateType:[{
        //change to rateTypeId
        rateTypeId : {
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
        
    }],
    

// company Reservation
// change to companyId
    companyReservation :[{
        companyId:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }

    }],


// bar reservation
    barRateReservation :[{
        bookingTypeId:{
                type:String,
                default:""
        },

        logId:{
            type:String,
            default:""
        }
        
    }],


// discount reservation
    discountReservation :[{
        // cahnge to id
        bookingType:[{
            bookingTypeId:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
// changed to discountPlanId
        discountPlan:[{
            //change to id
            discountPlanId :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }

        }],
        

        discountType:[{
            // changr to id
            discountTypeId :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        

        discountAmount:[{
            discountAmount :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }]
        
}],



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

    remark :[{
        specialRemark:[{
            specialRemark:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
        internalNote:[{
            internalNote :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }]
        
    }],

    //name will be changed to reservationRate
    reservationRate:[{
        roomCharges:[{
            roomCharges:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
    
        }],


        extras:[{
            extras:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
       
        taxes:[{
            taxes:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
       
        from:[{
            from:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        

        to:[{
            to:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
        grandTotal:[{
            grandTotal:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }]

    }],

    applyDiscount:[{
        applyDiscount:{
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
    
    }],

    
    paymentDetails:[{
        billTo:[{
            billTo:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
        paymentNote:[{
            paymentNote:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }]
        
    }],

    reservationNumber:{
        type:String,
        default:""
    },

    reservationIds:[{
        
         type:String,
         default:""
        
    }]
},

{
    versionKey : false
}


)

const bookingModel = db1.model("bookingDetails",booking)

export default bookingModel

import mongoose  from "mongoose";
import db1 from "../db/conn.js"
const booking = new mongoose.Schema({
    
    propertyId:{
        type:String,
        default:""
    },

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
        rateType : {
            type:String,
            default:""
        },

        logId:{
            type:String,
            default:""
        }
        
    }],
    

// company Reservation
    companyReservation :[{
        companyName:{
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
        bookingType:{
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
        bookingType:[{
            bookingType:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        

        discountPlan:[{
            discountPlan :{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }

        }],
        

        discountType:[{
            discountType :{
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
        roomType :[{
            roomType:{
                type:String,
                default:""
            },

            logId:{
                type:String,
                default:""
            }
        }],
        
        ratePlan:[{
            ratePlan :{
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
            extraInclusion :{
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

    reservationSummary:[{
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
        
    }]

},

{
    versionKey : false
}


)

const bookingModel = db1.model("bookingDetails",booking)

export default bookingModel
import mongoose from 'mongoose';
import db1 from '../db/conn.js'

const lostAndFoundSchema = new mongoose.Schema({
    propertyId:{
        type:String,
        default:''
    },
    lostAndFoundId:{
        type:String,
        default:''
    },
    createdBy: {
        type: String,
        default: ''
    },

    createdOn: {
        type: String,
        default: ''
    },
    itemImage:[{
        itemImage:{
            type:String,
            default:''
    
        },
        logId:{
            type:String,
            default:''
        },
    }],
    description:[{
        description:{
            type:String,
            default:''
        },
        logId:{
            type:String,
            default:''
        },
    }],
    dateFound:[{
        dateFound:{
            type:String,
            default:''
        },
        logId:{
            type:String,
            default:''
        },
    }],
    foundBy:[{
        foundBy:{
            type:String,
            default:''
        },
        logId:{
            type:String,
            default:''
        },
    }],
    locationFound:[{
        locationFound:{
            type:String,
            default:''
        },
        logId:{
            type:String,
            default:''
        },
    }],
    StorageLocation:[{
        StorageLocation:{
            type:String,
            default:''
        },
        logId:{
            type:String,
            default:''
        }
    }],

    claimStatus:{
        type:String,
        default:"unclaimed"
    },

    claimantName:[{
        claimantName:{
            type:String,
            default:'' 
        },
        logId:{
            type:String,
            default:''
        }

    }],

    contact:[{
        contact:{
            type:String,
            default:'' 
        },
        logId:{
            type:String,
            default:''
        }
    }] , 
    proofOfOwnership:[{
        
        proofOfOwnership:{
            type:String,
            default:'' 
        },
        logId:{
            type:String,
            default:''
        }

    }],

    imageProof:[{
        imageProof:{
            type:String,
            default:'' 
        },
        logId:{
            type:String,
            default:''
        }
    }]
     
        
})

const lostAndFound = db1.model('lostandfound',lostAndFoundSchema)

export default lostAndFound
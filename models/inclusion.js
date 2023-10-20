import mongoose, { Mongoose, Schema , model } from "mongoose";

const inclusion = new mongoose.Schema({
    inclusionArray:[{
        inclusionId:{
            type:String,
            default:""
        },
        inclusionName:{
            type:String,
            default:""
        },
        defaultPostingRule:{
            type:String,
            default:""
        },
        defaultChargeRule:{
            type:String,
            default:""
        },
        inclusionType:{
            type:String,
            default:""
        },
        defaultPrice:{
            type:String,
            default:""
        }
       
    }, 
    {
        versionKey: false
    }],
   
})


const inclusionDetails = new mongoose.model("inclusionDetails",inclusion)
export default inclusionDetails
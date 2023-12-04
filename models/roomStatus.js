import mongoose  from "mongoose";
import db1 from '../db/conn.js'; 

const roomStatusSchema = new mongoose.Schema({
    propertyId:{
        type:String,
        default:""
    },
    floorId:{
        type:String,
        default:'',

    },
    rooms:[{
        roomId:{
            type:String,
            default:""
        },
        roomStatus:[{
            roomStatus:{
                type:String,
                default:""
            },
            date:{
                type:String,
                default:''
            }
        }]
    }]

  
})
const roomStatus = db1.model('roomstatus',roomStatusSchema)

export default roomStatus
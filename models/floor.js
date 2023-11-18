
import mongoose from "mongoose";
import db1 from "../db/conn.js";


const floor = new mongoose.Schema({

    propertyId :{
        type:String,
        default:""
    },

    floorInHotel:[{
        floorInHotel:{
            type:String,
            default:''
        },
    }],

  floorCountStart:[{
    floorCountStart:{
        type:String,
        default:''
    }
  }],

    floorDetails : [{

            floorId: {
                type: String,
                default: ''
              },
                floorName : {
                    type:String,
                    default:""
                },
                roomsInFloor : {
                    type:String,
                    default: "",
                },

                roomNumberPrefix : {
                    type:String,
                    default: "",
                },
                floorType:{
                    type:String,
                    default:''
                },
                amenities : [{
                    type:String,
                    default:"",
                }],
        }],

},

{
    versionKey : false
}

)
  
  

const floorData = db1.model("floorDetails",floor)

export default floorData
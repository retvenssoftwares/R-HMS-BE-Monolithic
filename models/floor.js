
import mongoose from "mongoose";
import db1 from "../db/conn.js";
import { generateFourDigitRandomNumber, generateString } from "../helpers/helper.js";
import Randomstring from "randomstring";

const floor = new mongoose.Schema({

    propertyId :{
        type:String,
        default:""
    },
  
    floorInHotel : [{

            floorId: {
                type: String,
                default: await generateFourDigitRandomNumber(),
              },
        
            floorName : [{

                floorName : {
                    type:String,
                    default:""
                },

                logId:{
                    type:String,
                    default: "",
                }
              
            }],
        
            roomsInFloor :[{

                roomsInFloor : {
                    type:String,
                    default: "",
                },

                logId:{
                    type:String,
                    default:"",
                }
               
            }],

            roomNumberPrefix :[{

                roomNumberPrefix : {
                    type:String,
                    default: "",
                },

                logId:{
                    type:String,
                    default: "",
                }
              
            }],

            amenities : [{

                amenities : [{
                    type:String,
                    default:"",
                }],

                logId:{
                    type:String,
                    default:"",
                }
               
            }],

            seriesStart : [{

                seriesStart : {
                    type:String,
                    default:""
                },

                logId:{
                    type:String,
                    default:"",
                }
               
            }]
            
        }],

},

{
    versionKey : false
}

)


floor.pre('save', async function (next) {
    const floor = this;
    for (const detail of floor.floorInHotel) {
      detail.floorId = await generateFourDigitRandomNumber();
    //   detail.floorName.logId = await generateString()
    //   detail.roomsInFloor.logId = await generateString()
    //   detail.roomNumberPrefix.logId = await generateString()
    //   detail.amenities.logId = await generateString()
    //   detail.seriesStart = await generateString()
    }
    next();
});
  
  

const floorData = db1.model("floorDetails",floor)

export default floorData
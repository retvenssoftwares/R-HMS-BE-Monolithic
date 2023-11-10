import mongoose from "mongoose";
import db1 from "../db/conn.js";
import { generateFourDigitRandomNumber } from "../helpers/helper.js";

const roomInFloorData = new mongoose.Schema({

    propertyId : {
        type : String,
         default:""
    },

    floorId : {
        type : String,
        default:""
    },


        room : [{
            roomTypeId  :{
                type:String,
                default:""
            },

            houseKeepingStatus:[{
                houseKeepingStatus:{
                    type:String,
                    default:""
                },

                
             logId:{
                type:String,
                default:""
            }
            
            }],

            roomName : [{
                roomName:{
                    type:String,
                    default:""
                },
                
              logId:{
                type:String,
                default:""
            }
            }],

            roomId : {
                type:String,
                default: await generateFourDigitRandomNumber(),
            }
        }],

},

{
    versionKey : false
}
)


roomInFloorData.pre('save', async function (next) {
    const floor = this;
    for (const room of floor.room) {
      room.roomId = await generateFourDigitRandomNumber();
    }
    next();
  });
const roomFloorDetails = db1.model("roomInFloorDetails",roomInFloorData)

export default roomFloorDetails

import mongoose from "mongoose";
import db1 from "../db/conn.js";
import { generateFourDigitRandomNumber } from "../helpers/helper.js";

// const generateRandomFloorId = async () => {
//     return await generateFourDigitRandomNumber();
//   };
  

const floor = new mongoose.Schema({

    propertyId :{
        type:String,
        default:""
    },
  
    floorInHotel : [{

        floorDetails :[{

            floorId: {
                type: String,
                default: await generateFourDigitRandomNumber(),
              },
        
            floorName : [{

                floorName : {
                    type:String,
                    default:""
                }
              
            }],
        
            roomsInFloor :[{

                roomsInFloor : {
                    type:String,
                    default:""
                }
               
            }],

         

            roomNumberPrefix :[{

                roomNumberPrefix : {
                    type:String,
                    default:""
                }
              
            }],

            amenities : [{
                type:String,
                default:""
            }],

            seriesStart : [{

                seriesStart : {
                    type:String,
                    default:""
                }
               
            }]
            
        }],

        logId:{
            type:String,
            default:""
        }
       
    }]

},

{
    versionKey : false
}

)


floor.pre('save', async function (next) {
    const floor = this;
    for (const detail of floor.floorInHotel[0].floorDetails) {
      detail.floorId = await generateFourDigitRandomNumber();
    }
    next();
});
  
  

const floorData = db1.model("floorDetails",floor)

export default floorData
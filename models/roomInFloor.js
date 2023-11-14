import mongoose from "mongoose";
import db1 from "../db/conn.js";
import { generateFourDigitRandomNumber } from "../helpers/helper.js";

const roomInFloorData = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ""
    },

    floorData: [{
        floorId: {
            type: String,
            default: ""
        },

        room: [{
            roomTypeId: {
                type: String,
                default: ""
            },

            houseKeepingStatus: [{
                houseKeepingStatus: {
                    type: String,
                    default: ""
                },


                logId: {
                    type: String,
                    default: ""
                }

            }],

            roomNumber: [{
                roomNumber: {
                    type: String,
                    default: ""
                },

                logId: {
                    type: String,
                    default: ""
                }
            }],

            roomId: {
                type: String,
                default: await generateFourDigitRandomNumber(),
            }
        }],

    }]


},

    {
        versionKey: false
    }
)


roomInFloorData.pre('save', async function (next) {
    const floorData = this;
  
    if (floorData.floorData && Array.isArray(floorData.floorData)) {
      for (const floor of floorData.floorData) {
        if (floor.room && Array.isArray(floor.room)) {
          for (const room of floor.room) {
            room.roomId = await generateFourDigitRandomNumber();
          }
        }
      }
    }
  
    next();
  });
  

const roomFloorDetails = db1.model("roomInFloorDetails", roomInFloorData)

export default roomFloorDetails
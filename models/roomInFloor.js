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

           
                houseKeepingStatus: {
                    type: String,
                    default: ""
                },
            
                roomNumber: {
                    type: String,
                    default: ""
                },

            roomId: {
                type: String,
                default:''
            }
        }],

    }]


},

    {
        versionKey: false
    }
)
const roomFloorDetails = db1.model("roomInFloorDetails", roomInFloorData)

export default roomFloorDetails
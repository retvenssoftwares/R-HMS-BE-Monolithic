import mongoose from "mongoose";
import roomInFloor from "../../models/roomInFloor.js"

export const getRoomByFloorId = async(req,res)=>{

    const {propertyId , floorId} = req.body

    const roomDetails = await roomInFloor.findOne({propertyId : propertyId , floorId : floorId})

    if(!roomDetails){
        return res.status(404).json({message : "room not found" , statusCode : 404})
    }

    return res.status(200).json({data : roomDetails.room})


}
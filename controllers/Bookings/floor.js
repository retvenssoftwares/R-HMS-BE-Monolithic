import mongoose, { model, mongo } from "mongoose"
import floor from "../../models/floor.js"
import Randomstring from "randomstring"
import roomFloorData from "../../models/roomInFloor.js"

export const addRoomInfloor = async(req,res)=>{

  try{

    const {floorDetails ,propertyId}  = req.body

    for(let i = 0 ; i < floorDetails.length ; i++){
      var floorData = new floor({
        propertyId : propertyId,
        floorInHotel : [{
            floorDetails : floorDetails,
            logId : Randomstring.generate(10)
        }],
    
      })

    }

    await floorData.save()

    

    // await floorData.save()
    return res.status(200).json({message : "rooms added successfully" , statusCode : 200})

  }catch(err){
    console.log(err)
    return res.status(500).json({message : "Internal server error" , statusCode : 500})
  }

 


}



export const roomDetails = async(req,res)=>{
  try {
    const {propertyId , room , floorId} = req.body
  
    for(let i = 0 ; i < room.length ; i++){
    
      var data = new roomFloorData({

        propertyId : propertyId, 
        floorId : floorId,

        roomDetails : [{
          room : room,
          logId : Randomstring.generate(10)
        }]

      })
    }

    await data.save()

    res.send("room added ")
  }catch(err){
    console.log(err)
   return res.send(err)
  }
}
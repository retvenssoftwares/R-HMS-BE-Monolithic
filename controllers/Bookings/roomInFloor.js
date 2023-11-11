import mongoose, { model, mongo } from "mongoose"
import floor from "../../models/floor.js"
import Randomstring from "randomstring"
import roomFloorData from "../../models/roomInFloor.js"



export const roomDetails = async(req,res)=>{
    try {
      const {propertyId , room , floorId} = req.body
    
      for(let i = 0 ; i < room.length ; i++){
      
        var data = new roomFloorData({
  
          propertyId : propertyId, 
          floorId : floorId,
  
          room : room,
       
        
  
        })
      }
  
      await data.save()
  
      return res.status(200).json({message : "room Added Successfully" , statusCode : 200})
    }catch(err){
      console.log(err)
     return res.status(500).json({message : "Internal Server error" , statusCode : 500})
    }
}
  
  
  
  
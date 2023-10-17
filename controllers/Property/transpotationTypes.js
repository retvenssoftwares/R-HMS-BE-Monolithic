import transportation from "../../models/transportationTypes.js"
import verifying  from "../../models/verifiedUsers.js"
import randomString  from "randomstring"
import {getCurrentUTCTimestamp} from "../../helpers/helper.js"
const transportationAdd = async(req,res)=>{
   
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authCode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }
   
    const data = transportation({
        transportationId : randomString.generate(7),
        shortCode:req.body.shortCode,
        propertyId : req.body.propertyId,
        roomTypeName:req.body.roomTypeName,
        createdBy : req.body.createdBy,
        createdOn : getCurrentUTCTimestamp(),
    })

    await data.save()
}


const updateTransportation = async(req,res)=>{
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authCode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }
    const add = await transportation.updateOne(
        { propertyId: req.body.propertyId },
        {
          $push: {
            updatedArray: {
              propertyId : req.body.propertyId,
              roomTypeName: req.body.roomTypeName,
              lastModifiedBy: req.body.lastModified,
              lastModifiedOn: getCurrentUTCTimestamp()// assuming you want to store the current date as a string
            }
          }
        }
      );
      
    if(!add){
        return res.status(200).json({message:"Records not found"})
    }
    return res.status(200).json({message:"Transportation added successfully"})

   
}


const getTransportation = async(req,res)=>{

    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authCode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }
    const getDetails = await transportation.findOne({propertyId : req.body.propertyId})
    if(!getDetails){
        return res.status(500).json({
            message : "Data not found"
        })
    }
    if(getDetails.updatedArray.length>0){
        return res.status(200).json(getDetails.updatedArray[0])
    }
    return res.status(200).json(getDetails)
}

export  {transportationAdd , updateTransportation , getTransportation}
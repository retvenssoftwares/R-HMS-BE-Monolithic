import transportation from "../../models/transportationTypes.js"
import verifying  from "../../models/verifiedUsers.js"
import randomString  from "randomstring"
import 
const transportationAdd = async(req,res)=>{
    const authCode = req.headers["authCode"]
    const UserauthCode = await verifying.findOne({authCode:authCode})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const data = transportation({
        transportationId : randomString.generate(7),
        shortCode:req.body.shortCode,
        roomTypeName:req.body.roomTypeName,
        createdBy : req.body.createdBy,
        createdOn : req.body.createdOn,
        lastModified : req.body.lastModified
    })

    await data.save()
}


const updateTransportation = async(req,res)=>{
    const authCode = req.headers["authCode"]
    const UserauthCode = await verifying.findOne({authCode:authCode})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const add = await transportation.updateOne({transportationId:req.body.transportationId} , {$set :{shortCode : req.body.shortCode ,roomTypeName:req.body.roomTypeName, createdBy:req.body.createdBy, lastModified:req.body.lastModified }})
    if(!add){
        return res.status(200).json({message:"Records not found"})
    }
    return res.status(200).json({message:"Transportation added successfully"})

   
}


const getTransportation = async(req,res)=>{

    const authCode = req.headers["authCode"]
    const UserauthCode = await verifying.findOne({authCode:authCode})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const getDetails = await transportation.findOne({transportationId : req.body.transportationId})
    if(!getDetails){
        return res.status(500).json({
            message : "Data not found"
        })
    }
    return res.status(200).json(getDetails)
}

export default {transportationAdd , updateTransportation , getTransportation}
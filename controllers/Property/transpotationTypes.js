import transportation from "../../models/transportationTypes.js"
import verifying  from "../../models/verifiedUsers.js"
import randomString  from "randomstring"
import {convertTimestampToCustomFormat, getCurrentUTCTimestamp} from "../../helpers/helper.js"
export const transportationAdd = async(req,res)=>{
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authcode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }
   
    const data = transportation({
        transportationId : randomString.generate(7),
        shortCode:req.body.shortCode,
        propertyId : req.body.propertyId,
        roomTypeName:req.body.roomTypeName,
        createdBy : req.body.createdBy,
        createdOn : await getCurrentUTCTimestamp(),
    })

    await data.save()

    return res.status(200).json({message:"Transportation added successfully"})
}


export const updateTransportation = async(req,res)=>{
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authcode"]
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
              lastModifiedBy: req.body.lastModifiedBy,
              lastModifiedOn: await getCurrentUTCTimestamp()// assuming you want to store the current date as a string
            }
          }
        }
      );
      
    if(!add){
        return res.status(200).json({message:"Records not found"})
    }
    return res.status(200).json({message:"Transportation Updated successfully"})

   
}


export const getTransportation = async(req,res)=>{

    const UserauthCode = await verifying.findOne({userId:req.params.userId})
    const targetTimeZone = req.body.targetTimeZone
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authcode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }

    const getDetails = await transportation.findOne({propertyId : req.params.propertyId})
    if(!getDetails){
        return res.status(500).json({
            message : "Data not found"
        })
    }
    if (getDetails.updatedArray.length > 0) {

        const lastModifiedOn = getDetails.updatedArray[0].lastModifiedOn; // Assuming lastModifiedOn is in UTC format
        //const targetTimeZone = 'Asia/Kolkata'; // Replace with your desired time zone
        const formattedLastModifiedOn = convertTimestampToCustomFormat(lastModifiedOn, targetTimeZone);

        getDetails.updatedArray[0].lastModifiedOn = formattedLastModifiedOn;
    
        return res.status(200).json(getDetails.updatedArray[0]);
    }else{
        const time = getDetails.createdOn
        const formattedLastModifiedOn = convertTimestampToCustomFormat(time, targetTimeZone);
        getDetails.createdOn = formattedLastModifiedOn
    }
    return res.status(200).json(getDetails)
}


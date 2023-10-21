import { convertTimestampToCustomFormat, getCurrentUTCTimestamp } from "../../helpers/helper.js";
import businessSourcesModel from "../../models/businessSources.js";
import verifying  from "../../models/verifiedUsers.js"
import randomString  from "randomstring"

export const addBusinessSources = async(req,res)=>{
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }

    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authcode"]

    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }

    const data = businessSourcesModel({
        sourceId : randomString.generate(7),
        shortCode:req.body.shortCode,
        propertyId : req.body.propertyId,
        sourceName : req.body.sourceName,
        createdBy : req.body.createdBy,
        createdOn : await getCurrentUTCTimestamp(),
    })

    await data.save()

    return res.status(200).json({message:"BusinessSource added successfully"})

}


export const updateBusinessSources = async(req,res)=>{
    const UserauthCode = await verifying.findOne({userId:req.body.userId})
    if(!UserauthCode){
        return res.status(200).json({message: "Invalid data"})
    }
    const{authCode} = UserauthCode
    const authCodeDetails = req.headers["authcode"]
    if(authCodeDetails !== authCode){
        return res.status(500).json({message:"Invalid data"})
    }

    const add = await businessSourcesModel.updateOne(
        { propertyId: req.body.propertyId },
        {
          $push: {
            updatedArray: {
              propertyId : req.body.propertyId,
              shortCode:req.body.shortCode,
              sourceName: req.body.sourceName,
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

export const getBusinessSources = async(req,res)=>{
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

    const getDetails = await businessSourcesModel.findOne({propertyId : req.params.propertyId})
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
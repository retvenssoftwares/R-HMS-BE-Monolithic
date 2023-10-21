import userModel from "../../models/user.js"
import verifyUserModel from "../../models/verifiedUsers.js"
import propertyModel from "../../models/property.js"
import propertyChain from "../../models/propertychain.js"
import logsModel from "../../models/logsModel.js"
import randomstring from "randomstring"
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
    uploadImageToS3
  } from "../../helpers/helper.js";
const verifyUserProperty =  async (req,res)=>{

    const {userId , deviceType , ipAddress} = req.body.userId
    
    // verify the user
    await userModel.updateOne({userId : userId} , {$set: {verificationStatus : "true"}})

    const user = await userModel.findOne({userId : userId})

    const propertyTypeSOC = user.propertyTypeSOC

    console.log(propertyTypeSOC) 

    if(propertyTypeSOC === "Single"){
        const singleProperty = user.singlePropertyDetails[0]
        //console.log(singleProperty)
        const verifyUserDetails = new verifyUserModel({
            userId : user.userId,
            firstName : user.firstName,
            role : user.role,
            lastName : user.lastName,
            designation: user.designation,
            phoneNumber : user.phoneNumber,
            username: user.username,
            hotelRcode : user.hotelRcode,
            authCode :user.authCode,
            email : user.email,
            link : user.link,
            password : user.password,
            propertyTypeSOC : user.propertyTypeSOC,
            verificationStatus : user.verificationStatus,

        })

        await verifyUserDetails.save()
        //console.log({amenities : singleProperty.amenities})

        const property = new propertyModel({
            userId : singleProperty.userId,
            propertyId : singleProperty.propertyId,
            dateUTC : singleProperty.dateUTC,
            dateLocal : singleProperty.dateLocal,
            country : singleProperty.country,
            propertyAddress1 : singleProperty.propertyAddress1,
            postCode : singleProperty.postCode,
            city : singleProperty.city,
            state : singleProperty.state,
            location : singleProperty.location,
            propertyName : singleProperty.propertyName,
            rating : singleProperty.rating,
            //propertyManagement : singleProperty.propertyManagement,
            management : singleProperty.management,
            amenities : singleProperty.amenities,
            checkInTime : singleProperty.checkInTime,
            checkOutTime : singleProperty.checkOutTime,
            coverPhoto : singleProperty.coverPhoto,
            hotelLogo : singleProperty.hotelLogo,
            roomType : singleProperty.roomType,
            propertyEmail: singleProperty.propertyEmail,
            hotelRCode : singleProperty.hotelRCode,
            //propertyChainName : singleProperty.propertyChainName,
            propertyType :  singleProperty.propertyType,
            websiteUrl : singleProperty.websiteUrl,
            baseCurrency : singleProperty.baseCurrency,
            //propertyChainName : singleProperty.propertyChainName,
            propertyTypeName : singleProperty.propertyTypeName,
            starCategory :  singleProperty.starCategory,
            phoneNumber : singleProperty.phoneNumber,
            reservationNumber : singleProperty.reservationNumber,
            registrationNumber : singleProperty.registrationNumber,
            roomsInProperty : singleProperty.roomsInProperty,
            taxName : singleProperty.taxName,
            ratePercent : singleProperty.ratePercent,
            propertyRating : singleProperty.propertyRating,
            propertyDescription : singleProperty.propertyDescription,
           

        })

        await property.save()
        
        if  (singleProperty.propertyName !== "") {
        const add =  logsModel({
            propertyId : singleProperty.propertyId,

             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyName",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyName,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })

        await add.save()
    }else if(singleProperty.propertyAddress1 !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,

             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyAddress1",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyAddress1,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.postCode !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,

             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "postCode",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.postCode,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.city !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,

             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "city",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.city,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.state !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,

             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "state",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.state,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.state !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "location",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.location,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.state !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "location",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.location,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.rating !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "rating",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.rating,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.management !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "management",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.management,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.amenities !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "amenities",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.amenities,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.checkInTime !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "checkInTime",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.checkInTime,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.checkOutTime !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "checkOutTime",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.checkOutTime,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.coverPhoto !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "coverPhoto",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.coverPhoto,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.hotelLogo !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "hotelLogo",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.hotelLogo,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.roomType !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "roomType",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.roomType,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.propertyEmail !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyEmail",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyEmail,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.hotelRCode !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "hotelRCode",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.hotelRCode,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.propertyType !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyType",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyType,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.websiteUrl !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "websiteUrl",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.websiteUrl,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.baseCurrency !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "baseCurrency",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.baseCurrency,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.propertyTypeName !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyTypeName",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyTypeName,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.starCategory !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "starCategory",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.starCategory,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.phoneNumber !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "phoneNumber",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.phoneNumber,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.reservationNumber !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "reservationNumber",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.reservationNumber,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.registrationNumber !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "registrationNumber",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.registrationNumber,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.roomsInProperty !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "roomsInProperty",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.roomsInProperty,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.taxName !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "taxName",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.taxName,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.ratePercent !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "ratePercent",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.ratePercent,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.propertyRating !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyRating",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyRating,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
        await add.save()
    }else if(singleProperty.propertyDescription !== ""){
        const add =  logsModel({
            propertyId : singleProperty.propertyId,
             data :[{
                propertyInfo:[{
                    logId : randomstring.generate(7),
                    fieldName : "propertyDescription",
                    lasteModifiedBy : singleProperty.userId,
                    lasteModifiedAt : getCurrentUTCTimestamp(),
                    currentValue : singleProperty.propertyDescription,
                    deviceType : deviceType,
                    ipAddress : ipAddress
                }]
             }]
        })
    }
    await add.save()
        
        
    }else{
        const multipleProperty = user.multipleData[0]
        const verifyUserDetails = new verifyUserModel({
            userId : user.userId,
            firstName : user.firstName,
            role : user.role,
            lastName : user.lastName,
            designation: user.designation,
            phoneNumber : user.phoneNumber,
            username: user.username,
            hotelRcode : user.hotelRcode,
            authCode :user.authCode,
            email : user.email,
            link : user.link,
            password : user.password,
            propertyTypeSOC : user.propertyTypeSOC,
            verificationStatus : user.verificationStatus,

        })

        await verifyUserDetails.save()

        const propertChain = new propertyChain({
            userId: multipleProperty.userId,
            propertyChainId: multipleProperty.propertyChainId,
            dateUTC: multipleProperty.dateUTC,
            dateLocal: multipleProperty.dateLocal,
            numberOfProperties: multipleProperty.numberOfProperties,
            propertyChainName: multipleProperty.propertyChainName,
            propertyType: multipleProperty.propertyType,
            hotelLogo: multipleProperty.hotelLogo,
            hotelRCode: multipleProperty.hotelRCode,
            propertyName: multipleProperty.propertyName,
            websiteUrl: multipleProperty.websiteUrl,
            baseCurrency: multipleProperty.baseCurrency
            
        })
        
        await propertChain.save()
 

    }


}

export default verifyUserProperty
import userModel from "../../models/user.js"
import verifyUserModel from "../../models/verifiedUsers.js"
import propertyModel from "../../models/property.js"
import propertyChain from "../../models/propertychain.js"
import propertyImageModel from "../../models/propertyImages.js"
import { getCurrentUTCTimestamp } from "../../helpers/helper.js"
import logsModel from "../../models/logsModel.js"
import {sendEmail} from "../../helpers/helper.js"

const verifyUserProperty = async (req, res) => {
    try {
        const userId = req.body.userId

        const userDetails = userModel.findOne({userId : userId})

        if(!userDetails){
            return res.status(404).json({message : "Incorrect Details" , statuscode:404})
        }

        if(userDetails.length === 0){
            return res.status(200).json({message : "data not found" , statuscode:200})
        }

        // verify the user
        await userModel.updateOne({ userId: userId }, { $set: { verificationStatus: "true" } })

        const user = await userModel.findOne({ userId: userId })

        const propertyTypeSOC = user.propertyTypeSOC


        if (propertyTypeSOC === "Single") {
            const singleProperty = user.singlePropertyDetails[0]
            //console.log(singleProperty)
            const verifyUserDetails = new verifyUserModel({
                userId: user.userId,
                firstName: user.firstName,
                role: user.role,
                lastName: user.lastName,
                designation: user.designation,
                phoneNumber: user.phoneNumber,
                username: user.username,
                hotelRcode: user.hotelRcode,
                authCode: user.authCode,
                email: user.email,
                link: user.link,
                password: user.password,
                propertyTypeSOC: user.propertyTypeSOC,
                verificationStatus: user.verificationStatus,
                hotelCode: [{ hotelCode: singleProperty.propertyId }]
            })

            const savedVerifiedUserData = await verifyUserDetails.save()

            //console.log({amenities : singleProperty.amenities})

            const property = new propertyModel({
                userId: singleProperty.userId,
                propertyId: singleProperty.propertyId,
                dateUTC: singleProperty.dateUTC,
                dateLocal: singleProperty.dateLocal,
                country: singleProperty.country,
                //propertyAddress: singleProperty.propertyAddress,
                propertyAddress1: singleProperty.propertyAddress1,
                postCode: singleProperty.postCode,
                city: singleProperty.city,
                state: singleProperty.state,
                location: singleProperty.location,
                propertyName: singleProperty.propertyName,
                rating: singleProperty.rating,
                // propertyManagement: singleProperty.propertyManagement,
                management: singleProperty.management,
                amenities: singleProperty.amenities,
                // checkInTime: singleProperty.checkInTime,
                // checkOutTime: singleProperty.checkOutTime,
                coverPhoto: singleProperty.coverPhoto,
                hotelLogo: singleProperty.hotelLogo,
                roomType: singleProperty.roomType,
                propertyEmail: singleProperty.propertyEmail,
                //hotelRCode: singleProperty.hotelCode,
                //propertyChainName : singleProperty.propertyChainName,
                propertyType: singleProperty.propertyType,
                websiteUrl: singleProperty.websiteUrl,
                baseCurrency: singleProperty.baseCurrency,
                //propertyChainName : singleProperty.propertyChainName,
                propertyTypeName: singleProperty.propertyTypeName,
                starCategory: singleProperty.starCategory,
                phoneNumber: singleProperty.phoneNumber,
                reservationNumber: singleProperty.reservationNumber,
                registrationNumber: singleProperty.registrationNumber,
                roomsInProperty: singleProperty.roomsInProperty,
                taxName: singleProperty.taxName,
                ratePercent: singleProperty.ratePercent,
                propertyRating: singleProperty.propertyRating,
                propertyDescription: singleProperty.propertyDescription,
                createdOn: await getCurrentUTCTimestamp()
            })

            await property.save()

            // Create a propertyImages record and associate it with the property
            const propertyImages = new propertyImageModel({
                propertyId: singleProperty.propertyId, // Use the propertyId from the saved property record
                propertyImages: [],
                deletedPropertyImages: []
            });
            const propertyImagesLog = new propertyImageModel({
                propertyId: singleProperty.propertyId, // Use the propertyId from the saved property record
                propertyImages: [],
                deletedPropertyImages: []
            });

            // Save the propertyImages record
            await propertyImages.save();
            await propertyImagesLog.save();

            // create the log model
            const add = new logsModel({
                propertyId: singleProperty.propertyId
            })
            await add.save()


            const userName = savedVerifiedUserData.username[0].username
       

            await sendEmail(userName, property.propertyId, savedVerifiedUserData.hotelRcode, savedVerifiedUserData.email)


        } else {
            //console.log("xfcghvhjbkjnlkml")
            const multipleProperty = user.multipleData[0]
            const verifyUserDetails = new verifyUserModel({
                userId: user.userId,
                firstName: user.firstName,
                role: user.role,
                lastName: user.lastName,
                designation: user.designation,
                phoneNumber: user.phoneNumber,
                username: user.username,
                hotelRcode: user.hotelRcode,
                authCode: user.authCode,
                email: user.email,
                link: user.link,
                password: user.password,
                propertyTypeSOC: user.propertyTypeSOC,
                verificationStatus: user.verificationStatus,

            })


            const multiple = await verifyUserDetails.save()
            const userName = multiple.username[0].username
            const email = multiple.email
           // console.log(userName , multiple.email)

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

            const hotelcode =  ""
            const chainProperty = await propertChain.save();
            //console.log(chainProperty.hotelRCode)
            await sendEmail(userName, hotelcode, chainProperty.hotelRCode, email)
             
        }
        await userModel.deleteOne({ userId: userId })
        return res.status(200).json({ message: "User successfully verified", statuscode: 200 })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default verifyUserProperty
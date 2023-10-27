// import userModel from "../../models/user.js"
// import verifyUserModel from "../../models/verifiedUsers.js"
// import propertyModel from "../../models/property.js"
// import propertyChain from "../../models/propertychain.js"
// const verifyUserProperty = async (req, res) => {

//     const userId = req.body.userId

//     // verify the user
//     await userModel.updateOne({ userId: userId }, { $set: { verificationStatus: "true" } })

//     const user = await userModel.findOne({ userId: userId })

//     const propertyTypeSOC = user.propertyTypeSOC

//     console.log(propertyTypeSOC)

//     if (propertyTypeSOC === "Single") {
//         const singleProperty = user.singlePropertyDetails[0]
//         //console.log(singleProperty)
//         const verifyUserDetails = new verifyUserModel({
//             userId: user.userId,
//             firstName: user.firstName,
//             role: user.role,
//             lastName: user.lastName,
//             designation: user.designation,
//             phoneNumber: user.phoneNumber,
//             username: user.username,
//             hotelRcode: user.hotelRcode,
//             authCode: user.authCode,
//             email: user.email,
//             link: user.link,
//             password: user.password,
//             propertyTypeSOC: user.propertyTypeSOC,
//             verificationStatus: user.verificationStatus,
//             isLogin:user.isLogin

//         })

//         await verifyUserDetails.save()
//         //console.log({amenities : singleProperty.amenities})

//         const property = new propertyModel({
//             userId: singleProperty.userId,
//             propertyId: singleProperty.propertyId,
//             dateUTC: singleProperty.dateUTC,
//             dateLocal: singleProperty.dateLocal,
//             country: singleProperty.country,
//             propertyAddress: singleProperty.propertyAddress,
//             propertyAddress1: singleProperty.propertyAddress1,
//             postCode: singleProperty.postCode,
//             city: singleProperty.city,
//             state: singleProperty.state,
//             location: singleProperty.location,
//             propertyName: singleProperty.propertyName,
//             rating: singleProperty.rating,
//             propertyManagement: singleProperty.propertyManagement,
//             management: singleProperty.management,
//             amenities: singleProperty.amenities,
//             checkInTime: singleProperty.checkInTime,
//             checkOutTime: singleProperty.checkOutTime,
//             coverPhoto: singleProperty.coverPhoto,
//             hotelLogo: singleProperty.hotelLogo,
//             roomType: singleProperty.roomType,
//             propertyEmail: singleProperty.propertyEmail,
//             hotelRCode: singleProperty.hotelRCode,
//             //propertyChainName : singleProperty.propertyChainName,
//             propertyType: singleProperty.propertyType,
//             websiteUrl: singleProperty.websiteUrl,
//             baseCurrency: singleProperty.baseCurrency,
//             //propertyChainName : singleProperty.propertyChainName,
//             propertyTypeName: singleProperty.propertyTypeName,
//             starCategory: singleProperty.starCategory,
//             phoneNumber: singleProperty.phoneNumber,
//             reservationNumber: singleProperty.reservationNumber,
//             registrationNumber: singleProperty.registrationNumber,
//             roomsInProperty: singleProperty.roomsInProperty,
//             taxName: singleProperty.taxName,
//             ratePercent: singleProperty.ratePercent,
//             propertyRating: singleProperty.propertyRating,
//             propertyDescription: singleProperty.propertyDescription,


//         })

//         await property.save()


//     } else {
//         const multipleProperty = user.multipleData[0]
//         const verifyUserDetails = new verifyUserModel({
//             userId: user.userId,
//             firstName: user.firstName,
//             role: user.role,
//             lastName: user.lastName,
//             designation: user.designation,
//             phoneNumber: user.phoneNumber,
//             username: user.username,
//             hotelRcode: user.hotelRcode,
//             authCode: user.authCode,
//             email: user.email,
//             link: user.link,
//             password: user.password,
//             propertyTypeSOC: user.propertyTypeSOC,
//             verificationStatus: user.verificationStatus,
//             isLogin:user.isLogin

//         })

//         await verifyUserDetails.save()

//         const propertChain = new propertyChain({
//             userId: multipleProperty.userId,
//             propertyChainId: multipleProperty.propertyChainId,
//             dateUTC: multipleProperty.dateUTC,
//             dateLocal: multipleProperty.dateLocal,
//             numberOfProperties: multipleProperty.numberOfProperties,
//             propertyChainName: multipleProperty.propertyChainName,
//             propertyType: multipleProperty.propertyType,
//             hotelLogo: multipleProperty.hotelLogo,
//             hotelRCode: multipleProperty.hotelRCode,
//             propertyName: multipleProperty.propertyName,
//             websiteUrl: multipleProperty.websiteUrl,
//             baseCurrency: multipleProperty.baseCurrency

//         })

//         await propertChain.save()


//     }


// }

// export default verifyUserProperty




import userModel from "../../models/user.js"
import verifyUserModel from "../../models/verifiedUsers.js"
import propertyModel from "../../models/property.js"
import propertyChain from "../../models/propertychain.js"

const verifyUserProperty = async (req, res) => {
    const userId = req.body.userId

    try {
        // Verify the user
        await userModel.updateOne({ userId: userId }, { $set: { verificationStatus: "true" }})

        const user = await userModel.findOne({ userId: userId })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const propertyTypeSOC = user.propertyTypeSOC

        if (propertyTypeSOC === "Single") {
            const singleProperty = user.singlePropertyDetails[0]

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
                isLogin: user.isLogin
            })

            await verifyUserDetails.save()

            const property = new propertyModel({
                userId: singleProperty.userId,
            propertyId: singleProperty.propertyId,
            dateUTC: singleProperty.dateUTC,
            dateLocal: singleProperty.dateLocal,
            country: singleProperty.country,
            propertyAddress: singleProperty.propertyAddress,
            propertyAddress1: singleProperty.propertyAddress1,
            postCode: singleProperty.postCode,
            city: singleProperty.city,
            state: singleProperty.state,
            location: singleProperty.location,
            propertyName: singleProperty.propertyName,
            rating: singleProperty.rating,
            propertyManagement: singleProperty.propertyManagement,
            management: singleProperty.management,
            amenities: singleProperty.amenities,
            checkInTime: singleProperty.checkInTime,
            checkOutTime: singleProperty.checkOutTime,
            coverPhoto: singleProperty.coverPhoto,
            hotelLogo: singleProperty.hotelLogo,
            roomType: singleProperty.roomType,
            propertyEmail: singleProperty.propertyEmail,
            hotelRCode: singleProperty.hotelRCode,
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
            })

            await property.save()

            return res.status(200).json({ message: "User verified and data saved" });
        } else if (propertyTypeSOC === "Multiple")  {
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
                isLogin: user.isLogin
            })

            await verifyUserDetails.save()

            const propertychain = new propertyChain({
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

            await propertychain.save()
        }

            else {
                return res.status(400).json({ message: "Invalid propertyTypeSOC" });
            }
    

            return res.status(200).json({ message: "User verified and data saved" });
        
    } catch (error) {
        console.error("Error in verifyUserProperty:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default verifyUserProperty

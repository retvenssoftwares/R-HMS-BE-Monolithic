//import models
const propertyModel = require('../../models/Property/propertySetupModel')
const userModel = require('../../models/Users/hotelOwnerRegister');

const dateObject = new Date();

// console.log(formattedDateTime);

//export module
module.exports = async (req, res) => {
    try {
        //add fields
        const userId = req.params.userId
        const {
            propertyPinCode,
            registrationId,
            numberOfRooms,
            propertySortKey,
            propertyName,
            propertyWebsiteLink,
            propertyAddress,
            propertyLocation,
            propertyBasicCurrency,
            propertyStarCategory,
            propertyRatings,
            taxName,
            roomType,
            propertyTaxPercentage,
            phoneNo,
            email,
            propertyDescription,
            propertyRegistrationNo,
            propertyAmenities,
            addedBy,
            modifiedBy,
            modifiedDate,
            socialMedia1,
            socialMedia2,
            socialMedia3
        } = req.body

        //find user
        const getUser = await userModel.findOne({ userId: userId })
        let userRegId = getUser.registrationId
        // console.log(userRegId)
        if (userRegId !== registrationId || req.body.registrationId === undefined) {
            return res.status(200).json({ message: 'Invalid request' })
        }

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            //   timeZoneName: 'short'
        };

        const formattedDateTime = dateObject.toLocaleString('en-US', options);

        //create record
        const addProperty = new propertyModel({
            userId,
            propertyPinCode: propertyPinCode,
            propertySortKey: propertySortKey,
            propertyName: propertyName,
            propertyWebsiteLink: propertyWebsiteLink,
            propertyAddress: propertyAddress,
            propertyLocation: propertyLocation,
            propertyBasicCurrency: propertyBasicCurrency,
            propertyStarCategory: propertyStarCategory,
            numberOfRooms: numberOfRooms,
            timeStamp: formattedDateTime,
            propertyRatings: propertyRatings,
            taxName: taxName,
            roomType: roomType,
            propertyTaxPercentage: propertyTaxPercentage,
            phoneNo: phoneNo,
            email: email,
            propertyDescription: propertyDescription,
            propertyRegistrationNo: propertyRegistrationNo,
            propertyAmenities: propertyAmenities,
            addedBy: addedBy,
            modifiedBy: modifiedBy,
            modifiedDate: modifiedDate,
            socialMedia1: socialMedia1,
            socialMedia2: socialMedia2,
            socialMedia3: socialMedia3            
        });

        //save record
        const addedProperty = await addProperty.save();
        if (addedProperty) {
            return res.status(200).json({ message: "Property added successfully" })
        } else {
            res.status(400).json({ message: "Failed to add property" })
        }

        //catch error
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}
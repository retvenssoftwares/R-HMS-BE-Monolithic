//import models
const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const propertyModel = require('../../models/Property/propertySetupModel')
const userModel = require('../../models/Users/hotelOwnerRegister');
const apiname = require('../../models/Users/apiHittingArray')
const amenitiesModel = require('../../models/Property/amenities');
var randomstring = require("randomstring");
const multer = require('multer');
const { Router } = require('express');
const upload = multer();

const dateObject = new Date();



const uploadPropertyImages = async (req, res, next) => {
    upload.fields([
        // { name: 'hotelProfilepic', maxCount: 1 },
        { name: 'propertyData', maxCount: 5 },
        { name: 'logoUrl', maxCount: 1 }
    ])(req, res, async (err) => {
        try {
            // Upload hotelLogo to DigitalOcean Spaces
            let propertyImages = [];
            if (req.files['propertyData']) {
                for (const hotelLogo of req.files['propertyData']) {
                    const propertyImageId = randomstring.generate(10); // Generate a unique ID
                    const displayStatus = '1'; // Set the display status
                    const hotelLogoParams = {
                        Bucket: 'rown-space-bucket/propertyImages',
                        Key: hotelLogo.originalname,
                        Body: hotelLogo.buffer,
                        ContentType: hotelLogo.mimetype,
                        ACL: 'public-read'
                    };
                    await s3.upload(hotelLogoParams).promise();
                    const imageUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/propertyImages/${hotelLogo.originalname}`;
                    // Create an object with image details
                    const imageDetails = {
                        propertyImageId: propertyImageId,
                        propertyImage: imageUrl,
                        displayStatus: displayStatus
                    };
                    propertyImages.push(imageDetails);
                }
            }

            // Upload hotelCoverpic to DigitalOcean Spaces
            let propertyLogo;
            if (req.files['logoUrl']) {
                const hotelCoverpic = req.files['logoUrl'][0];
                const hotelCoverpicParams = {
                    Bucket: 'rown-space-bucket/propertyImages',
                    Key: hotelCoverpic.originalname,
                    Body: hotelCoverpic.buffer,
                    ContentType: hotelCoverpic.mimetype,
                    ACL: 'public-read'
                };
                await s3.upload(hotelCoverpicParams).promise();
                propertyLogo = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/propertyImages/${hotelCoverpic.originalname}`;
            }

            // Add other fields
            const userId = req.params.userId;
            const registrationId = req.body.registrationId
            const {
                propertyPinCode,
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
                socialMedia3,
                propertyState,
                propertyCity,
                ipAddress,
                deviceType,
                propertyId,
                propertyType,
                numberOfProperties,
                propertyChainType,
                propertyChainStarCategory,
                hotelBasicCurrency
            } = req.body;



            // Create a formatted timestamp
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: "Asia/Kolkata"
            };

            const formattedDateTime = new Date().toLocaleString('en-IN', options);

            //find user
            const getUser = await userModel.findOne({ userId: userId })
            if (!getUser) {
                return res.status(404).json({ message: 'User not found' })
            }
            let userRegId = getUser.registrationId
            // console.log(userRegId)

            if (userRegId !== registrationId) {
                // console.log(registrationId)
                return res.status(400).json({ message: 'Invalid request' })
            }

            // Create and save the property record
            const addProperty = new propertyModel({
                userId,
                propertyPinCode,
                propertySortKey,
                propertyName,
                propertyWebsiteLink,
                propertyAddress,
                propertyLocation,
                propertyBasicCurrency,
                propertyId,
                propertyStarCategory,
                numberOfRooms,
                timeStamp: formattedDateTime,
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
                propertyState,
                propertyCity,
                modifiedBy,
                modifiedDate,
                socialMedia1,
                socialMedia2,
                socialMedia3,
                propertyType,
                propertyImages,
                propertyLogo,
                numberOfProperties,
                propertyChainType,
                propertyAuthCode: randomstring.generate({
                    charset: ['numeric'],
                    length: 5
                }),
                propertyChainStarCategory,
                hotelBasicCurrency
            });



            // Save the record
            const addedProperty = await addProperty.save();

            // if (addedProperty) {
            //     const api = new apiname({
            //         propertyId: addedProperty.propertyId,
            //         apiArray: [
            //             {
            //                 timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            //                 role: getUser.role,
            //                 apiname: `Add Property`,
            //                 ipAddress: ipAddress,
            //                 userId: userId,
            //                 deviceType: deviceType
            //             },
            //         ],
            //     });

            //     await api.save();
                
            //}
            return res.status(200).json({ message: "Property added successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

module.exports = uploadPropertyImages;

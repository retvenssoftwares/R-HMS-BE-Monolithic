//import models
const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const propertyModel = require('../../models/Property/propertySetupModel')
const userModel = require('../../models/Users/hotelOwnerRegister');
const apiLogs = require('../../models/Users/apiHittingArray');
const amenitiesModel = require('../../models/Property/amenities');
var randomstring = require("randomstring");
const multer = require('multer');
const { Router } = require('express');
const upload = multer();

const dateObject = new Date();

// console.log(formattedDateTime);

//export module
// module.exports = async (req, res) => {
//     try {
//         //add fields
//         const userId = req.params.userId
//         const {
//             propertyPinCode,
//             registrationId,
//             numberOfRooms,
//             propertySortKey,
//             propertyName,
//             propertyWebsiteLink,
//             propertyAddress,
//             propertyLocation,
//             propertyBasicCurrency,
//             propertyStarCategory,
//             propertyRatings,
//             taxName,
//             roomType,
//             propertyTaxPercentage,
//             phoneNo,
//             email,
//             propertyDescription,
//             propertyRegistrationNo,
//             propertyAmenities,
//             addedBy,
//             modifiedBy,
//             modifiedDate,
//             socialMedia1,
//             socialMedia2,
//             socialMedia3,
//             propertyState,
//             propertyCity,
//             deviceIp,
//             deviceType,
//             propertyType,
//             numberOfProperties, //for hotel chain
//             propertyChainType, //for hotel chain
//             propertyChainStarCategory,
//             hotelBasicCurrency,
//             propertyLogo,
//             propertyImages
//         } = req.body

//         let logoUrl

//         // Upload the file to DigitalOcean Spaces if a file has been selected
//         if (req.file) {
//           const params = {
//             Bucket: 'rown-space-bucket/propertyLogo',
//             Key: req.file.originalname,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype,
//             ACL: 'public-read'
//           };
//           await s3.upload(params).promise();
//           logoUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/propertyLogo/${req.file.originalname}`;
//         }

//         const propertyData = await Promise.all(req.files.map(async (file) => {
//             const params = {
//               Bucket: 'rown-space-bucket/propertyImages',
//               Key: file.originalname,
//               Body: file.buffer,
//               ContentType: file.mimetype,
//               ACL: 'public-read'
//             };
//             await s3.upload(params).promise();
//             return { propertyImage: `https://rown-space-bucket.nyc3.digitaloceanspaces.com/propertyImages/${file.originalname}` };
//           }));

//           // Add current date to each media object
//           const imageWithStatus = propertyData.map((mediaObj) => {
//             return { ...mediaObj, propertyImageId: randomstring.generate(10) , displayStatus: '1', };
//           });    

//         //find user
//         const getUser = await userModel.findOne({ userId: userId })
//         let userRegId = getUser.registrationId
//         // console.log(userRegId)
//         if (userRegId !== registrationId || req.body.registrationId === undefined) {
//             return res.status(400).json({ message: 'Invalid request' })
//         }

//         const options = {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//             timeZone: "Asia/Kolkata"
//         };

//         const formattedDateTime = dateObject.toLocaleString('en-IN', options);

//         //create record
//         const addProperty = new propertyModel({
//             userId,
//             propertyPinCode: propertyPinCode,
//             propertySortKey: propertySortKey,
//             propertyName: propertyName,
//             propertyWebsiteLink: propertyWebsiteLink,
//             propertyAddress: propertyAddress,
//             propertyLocation: propertyLocation,
//             propertyBasicCurrency: propertyBasicCurrency,
//             propertyStarCategory: propertyStarCategory,
//             numberOfRooms: numberOfRooms,
//             timeStamp: formattedDateTime,
//             propertyRatings: propertyRatings,
//             taxName: taxName,
//             roomType: roomType,
//             propertyTaxPercentage: propertyTaxPercentage,
//             phoneNo: phoneNo,
//             email: email,
//             propertyDescription: propertyDescription,
//             propertyRegistrationNo: propertyRegistrationNo,
//             propertyAmenities: propertyAmenities,
//             addedBy: addedBy,
//             propertyState: propertyState,
//             propertyCity: propertyCity,
//             modifiedBy: modifiedBy,
//             modifiedDate: modifiedDate,
//             socialMedia1: socialMedia1,
//             socialMedia2: socialMedia2,
//             socialMedia3: socialMedia3,
//             propertyType: propertyType,
//             propertyImages: imageWithStatus,
//             propertyLogo: logoUrl,
//             numberOfProperties: numberOfProperties, //for hotel chain
//             propertyChainType: propertyChainType, //for hotel chain
//             propertyChainStarCategory: propertyChainStarCategory,
//             hotelBasicCurrency: hotelBasicCurrency
//         });

//         //save record
//         const addedProperty = await addProperty.save();
//         if (addedProperty) {
//             await apiLogs.updateOne(
//                 { userId: getUser.userId },
//                 {
//                     $push: {
//                         apiArray: {
//                             $each: [
//                                 {
//                                     apiname: "Add property",
//                                     role: getUser.role,
//                                     timestamp: formattedDateTime,
//                                     deviceIp: deviceIp,
//                                     deviceType: deviceType
//                                 }
//                             ],
//                             $position: 0
//                         }
//                     }
//                 }
//             );

//             return res.status(200).json({ message: "Property added successfully" })
//         } else {
//             res.status(400).json({ message: "Failed to add property" })
//         }

//         //catch error
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Internal server error' })
//     }
// }

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
                propertyType,
                numberOfProperties,
                propertyChainType,
                propertyChainStarCategory,
                hotelBasicCurrency
            } = req.body;

            const registrationId = req.body.registrationId



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
            if(!getUser) {
                return res.status(404).json({message: 'User not found'})
            }
            let userRegId = getUser.registrationId
            console.log(userRegId)
     
            if (userRegId !== registrationId) {
                console.log(registrationId)
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
                propertyChainStarCategory,
                hotelBasicCurrency
            });

          

            // Save the record
            const addedProperty = await addProperty.save();
            if (addedProperty) {
                await apiLogs.updateOne(
                    { userId: getUser.userId },
                    {
                        $push: {
                            apiArray: {
                                $each: [
                                    {
                                        apiname: "Add property",
                                        role: getUser.role,
                                        timestamp: formattedDateTime,
                                        ipAddress: ipAddress,
                                        deviceType: deviceType
                                    }
                                ],
                                $position: 0
                            }
                        }
                    }
                );

                res.status(200).json({ message: 'Property successfully added' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

module.exports = uploadPropertyImages;

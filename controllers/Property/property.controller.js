import randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import verifiedUser from "../../models/verifiedUsers.js";
import propertyImageModel from "../../models/propertyImages.js"
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
  uploadImageToS3
} from "../../helpers/helper.js";
import propertyLogs from "../../models/LogModels/propertyLogs.js"
import property from "../../models/property.js";
// import logsModel from "../../models/logsModel.js"
//upload property controller
const postProperty = async (req, res) => {
  try {
    const {
      userId,
      country,
      propertyAddress1,
      propertyAddress2,
      propertyName,
      postCode,
      state,
      city,
      baseCurrency,
      websiteUrl,
      propertyRating,
      propertyDescription,
      propertyType,
      phone,
      reservationPhone,
      propertyEmail,
      latitude,
      longitude,
      displayStatus,
      devicetype,
      ipAddress,
      amenityIds
    } = req.body;

    var hotelLogoId = randomstring.generate(8);

    const findUser = await verifiedUser.findOne({ userId });
    const authCodeValue = req.headers['authcode']

    let userRole=findUser.role[0].role
    if (!findUser || !userId) {
      return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue)

    if (result.success) {
      let imageUrl = '';

      const currentUTCTime = await getCurrentUTCTimestamp();

      let amenityIdsArray, amenityObjects;
      if (req.body.amenityIds) {
        amenityIdsArray = amenityIds.split(',');
        amenityObjects = amenityIdsArray.map((amenityId) => {
          return {
            amenityId,
            addedDate: currentUTCTime,
          };
        });
      }

      // Check if a single hotelLogo file is uploaded
      if (req.files['hotelLogo']) {
        imageUrl = await uploadImageToS3(req.files['hotelLogo'][0]);
      }

      //create record
      const newProperty = new propertyModel({
        userId,
        country,
        createdOn: currentUTCTime,
        createdBy: userRole,
        propertyId: randomstring.generate({ charset: 'numeric', length: 6 }),
        propertyAddress1: [
          {
            propertyAddress1,
            logId: randomstring.generate(10),
          },
        ],
        propertyAddress2: [
          {
            propertyAddress2,
            logId: randomstring.generate(10),
          },
        ],
        propertyName: [
          {
            propertyName: propertyName,
            logId: randomstring.generate(10),
          },
        ],
        postCode: [
          {
            postCode: postCode,
            logId: randomstring.generate(10),
          },
        ],
        
        displayStatus: [{ displayStatus: "1", logId: randomstring.generate(10) }],
       
        state: [
          {
            state: state,
            logId: randomstring.generate(10),
          },
        ],
        city: [
          {
            city:city,
            logId: randomstring.generate(10),
          },
        ],
        location: [{
          latitude: latitude,
          longitude: longitude,
          logId: randomstring.generate(10)
        }],
        propertyDescription: [
          {
            propertyDescription: propertyDescription,
            logId: randomstring.generate(10),
          },
        ],
        hotelLogo: imageUrl
          ? [
            {
              hotelLogoId,
              hotelLogo: imageUrl,
              logId: randomstring.generate(10),
            },
          ]
          : [],
        baseCurrency:[{
          baseCurrency:baseCurrency,
          logId: randomstring.generate(10)
        }],
        websiteUrl:[{
          websiteUrl: websiteUrl,
          logId: randomstring.generate(10)
        }],
        dateUTC: currentUTCTime,
        propertyType:[{
          propertyType: propertyType,
          logId:randomstring.generate(10)
        }],
        propertyRating:[{
          propertyRating:propertyRating,
          logId:randomstring.generate(10)
        }],
        reservationPhone:[{
          reservationPhone:reservationPhone,
          logId: randomstring.generate(10)
        }],
        phone:[{
          phone:phone,
          logId: randomstring.generate(10)
        }],
        propertyEmail: [{
          propertyEmail: propertyEmail,
          logId: randomstring.generate(10)
        }],
        amenities: [
          {
            amenities: amenityObjects,
            logId: randomstring.generate(10),
          },
        ],
      });

      // Save the property record
      const savedProperty = await newProperty.save();
      
      // Create a propertyImages record and associate it with the property
      const propertyImages = new propertyImageModel({
        propertyId: savedProperty.propertyId, // Use the propertyId from the saved property record
        propertyImages: [],
        deletedPropertyImages: []
      });

      // Save the propertyImages record
      await propertyImages.save();

      // save data in logs
      const addPropertyLogs = new propertyLogs({
        propertyId: savedProperty.propertyId,
        userId:userId,
        createdOn:currentUTCTime,
        country:country,
        createdBy:userRole,
        propertyAddress1:[{
          propertyAddress1:propertyAddress1,
          logId:savedProperty.propertyAddress1[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyAddress2:[{
          propertyAddress1:propertyAddress2,
          logId:savedProperty.propertyAddress2[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyName:[{
          propertyName:propertyName,
          logId:savedProperty.propertyName[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        postCode:[{
          postCode:postCode,
          logId:savedProperty.postCode[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        displayStatus:[{
          displayStatus:savedProperty.displayStatus[0].displayStatus,
          logId:savedProperty.displayStatus[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        state:[{
          state:state,
          logId:savedProperty.state[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        city:[{
          city:city,
          logId:savedProperty.city[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        location:[{
          latitude: latitude,
          longitude: longitude,
          logId:savedProperty.location[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyDescription:[{
          propertyDescription:propertyDescription,
          logId:savedProperty.propertyDescription[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        hotelLogo:[{
          hotelLogoId:savedProperty.hotelLogo[0].hotelLogoId,
          hotelLogo:imageUrl,
          logId:savedProperty.hotelLogo[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        baseCurrency:[{
          baseCurrency:baseCurrency,
          logId:savedProperty.baseCurrency[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyType:[{
          propertyType:propertyType,
          logId:savedProperty.propertyType[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyRating:[{
          propertyRating:propertyRating,
          logId:savedProperty.propertyRating[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        reservationPhone:[{
          reservationPhone:reservationPhone,
          logId:savedProperty.reservationPhone[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        phone:[{
          phone:phone,
          logId:savedProperty.phone[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        propertyEmail:[{
          propertyEmail:propertyEmail,
          logId:savedProperty.propertyEmail[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],
        amenities:[{
          amenities:amenityObjects,
          logId:savedProperty.amenities[0].logId,
          userId:userId,
          devicetype:devicetype,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        }],

      })
      await addPropertyLogs.save()


      // Push propertyId in the hotelCode array of findUser model
      findUser.hotelCode.push({
        hotelCode: savedProperty.propertyId
      });

      // Save the updated findUser
      await findUser.save();


      return res.status(200).json({ message: "New property added successfully", propertyId: savedProperty.propertyId, statuscode: 200 });


    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postProperty;
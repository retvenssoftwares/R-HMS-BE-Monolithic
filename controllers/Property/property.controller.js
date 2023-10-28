import randomString from "randomstring";
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
import logsModel from "../../models/logsModel.js"
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
      longitude
    } = req.body;

    var hotelLogoId = Randomstring.generate(8);

    const findUser = await verifiedUser.findOne({ userId });
    const authCodeValue = req.headers['authcode']


    if (!findUser || !userId) {
      return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue)

    if (result.success) {
      let imageUrl = '';
      const amenityIds = req.body.amenityIds;
      const amenityIdsArray = amenityIds.split(',');

      const currentUTCTime = await getCurrentUTCTimestamp();

      const amenityObjects = amenityIdsArray.map((amenityId) => {
        return {
          amenityId,
          addedDate: currentUTCTime,
        };
      });

      // Check if a single hotelLogo file is uploaded
      if (req.files['hotelLogo']) {
        imageUrl = await uploadImageToS3(req.files['hotelLogo'][0]);
      }

      //create record
      const newProperty = new propertyModel({
        userId,
        country,
        propertyId: Randomstring.generate(8),
        propertyAddress1: [
          {
            propertyAddress1,
            logId: randomString.generate(10),
          },
        ],
        propertyAddress2: [
          {
            propertyAddress2,
            logId: randomString.generate(10),
          },
        ],
        propertyName: [
          {
            propertyName: propertyName,
            logId: randomString.generate(10),
          },
        ],
        postCode: [
          {
            postCode: postCode,
            logId: randomString.generate(10),
          },
        ],
        state: [
          {
            state: state,
            logId: randomString.generate(10),
          },
        ],
        city: [
          {
            city,
            logId: randomString.generate(10),
          },
        ],
        location: [{
          latitude: latitude,
          longitude: longitude,
          logId: randomString.generate(10)
        }],
        propertyDescription: [
          {
            propertyDescription: propertyDescription,
            logId: randomString.generate(10),
          },
        ],
        hotelLogo: imageUrl
          ? [
            {
              hotelLogoId,
              hotelLogo: imageUrl,
              logId: randomString.generate(10),
            },
          ]
          : [],
        baseCurrency,
        websiteUrl,
        dateUTC: currentUTCTime,
        propertyType,
        propertyRating,
        reservationPhone,
        phone,
        propertyEmail: [{
          propertyEmail: propertyEmail,
          logId: randomString.generate(10)
        }],
        amenities: [
          {
            amenities: amenityObjects,
          },
        ],
      });

      // Save the property record
      const savedProperty = await newProperty.save();

      // Create a propertyImages record and associate it with the property
      const propertyImages = new propertyImageModel({
        propertyId: savedProperty.propertyId, // Use the propertyId from the saved property record
        propertyImages: []
      });

      // Save the propertyImages record
      await propertyImages.save();

      // create the log model
      const add = new logsModel({
        propertyId: propertyId
      })

      await add.save()

      return res.status(200).json({ message: "New property added successfully", statuscode: 200 });

    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postProperty;
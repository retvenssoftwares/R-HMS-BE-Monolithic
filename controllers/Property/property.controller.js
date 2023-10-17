import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import propertyImageModel from "../../models/propertyImages.js"
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadImageToS3
} from "../../helpers/helper.js";

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
          modifiedDate: currentUTCTime,
        },
      ],
      propertyAddress2: [
        {
          propertyAddress2,
          modifiedDate: currentUTCTime,
        },
      ],
      propertyName: [
        {
          propertyName: propertyName,
          modifiedDate: currentUTCTime,
        },
      ],
      postCode: [
        {
          postCode: postCode,
          modifiedDate: currentUTCTime,
        },
      ],
      state: [
        {
          state: state,
          modifiedDate: currentUTCTime,
        },
      ],
      city: [
        {
          city,
          modifiedDate: currentUTCTime,
        },
      ],
      location: [{
        latitude: latitude,
        longitude: longitude,
        modifiedDate: currentUTCTime
      }],
      propertyDescription: [
        {
          propertyDescription: propertyDescription,
          modifiedDate: currentUTCTime,
        },
      ],
      hotelLogo: imageUrl
        ? [
          {
            hotelLogoId,
            hotelLogo: imageUrl,
            modifiedDate: currentUTCTime,
          },
        ]
        : [],
      baseCurrency,
      websiteUrl,
      dateUTC: currentUTCTime,
      dateLocal: getCurrentLocalTimestamp(),
      propertyType,
      propertyRating,
      reservationPhone,
      phone,
      propertyEmail: [{
        propertyEmail: propertyEmail,
        modifiedDate: currentUTCTime
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

    return res.status(200).json({ message: "New property added successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export default postProperty;
import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import propertyImageModel from "../../models/propertyImages.js"
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadImageToS3,
  uploadMultipleImagesToS3
} from "../../helpers/helper.js";

//upload property controller
const postProperty = async (req, res) => {
  try {
    const {
      userId,
      country,
      propertyAddress,
      propertyName,
      postCode,
      state,
      city,
      baseCurrency,
      websiteUrl,
      propertyRating,
      propertyDescription,
      propertyType,
    } = req.body;

    var hotelLogoId = Randomstring.generate(8);

    let imageUrl = ''; // Initialize imageUrl

    // Check if a single hotelLogo file is uploaded
    if (req.files['hotelLogo']) {
      imageUrl = await uploadImageToS3(req.files['hotelLogo'][0]);
    }
    const imagesField = req.files['hotelImages'];

    let imageUrls = []
    if (imagesField) {
      imageUrls = await uploadMultipleImagesToS3(imagesField);
    }
    const currentUTCTime = await getCurrentUTCTimestamp();
    //create record
    const newProperty = new propertyModel({
      userId,
      country,
      propertyId: Randomstring.generate(8),
      propertyAddress: [
        {
          propertyAddress,
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
      propertyRating
    });

   
    // Save the property record
    const savedProperty = await newProperty.save();

    // Create a propertyImages record and associate it with the property
    const propertyImages = new propertyImageModel({
      propertyId: savedProperty.propertyId, // Use the propertyId from the saved property record
      propertyImages: imageUrls.map((imageUrl) => ({
        imageId: Randomstring.generate(8),
        image: imageUrl,
        displayStatus: '1', // You can set the displayStatus as needed
      })),
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

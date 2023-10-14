import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import propertyImageModel from "../../models/propertyImages.js"
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadImageToS3,
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

    let imageUrl = null; // Initialize imageUrl to null
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
    }

    const imagesField = req.files['hotelImages'];

    if (imagesField) {
      const imageUrls = await uploadImagesToS3(imagesField);
      console.log(imageUrls)
    }

    //create record
    const newProperty = new propertyModel({
      userId,
      country,
      propertyId: Randomstring.generate(8),
      propertyAddress: [
        {
          propertyAddress,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      propertyName: [
        {
          propertyName: propertyName,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      postCode: [
        {
          postCode: postCode,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      state: [
        {
          state: state,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      city: [
        {
          city,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      propertyDescription: [
        {
          propertyDescription: propertyDescription,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      hotelLogo: imageUrl
        ? [
          {
            hotelLogoId,
            hotelLogo: imageUrl,
            modifiedDate: getCurrentUTCTimestamp(),
          },
        ]
        : [],
      baseCurrency,
      websiteUrl,
      dateUTC: getCurrentUTCTimestamp,
      dateLocal: getCurrentLocalTimestamp,
      propertyType,
      propertyRating
    });

    await newProperty.save();

    return res.status(200).json({ message: "New property added successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export { postProperty };

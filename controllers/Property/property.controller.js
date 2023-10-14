import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import {
  getCurrentUTCTimestamp,
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
      propertyType,
    } = req.body;

    var hotelLogoId = Randomstring.generate(8);

    let imageUrl = null; // Initialize imageUrl to null
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
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
      propertyType,
    });

    await newProperty.save();

    return res.status(200).json({ message: "New property added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const editProperty = async (req, res) => {
  const filter = { propertyId: req.body.propertyId };

  const newData = {
    propertyName: req.body.propertyName,

  };

  const time = await getCurrentUTCTimestamp()
  console.log(time)

  const updateFields = {
    starCategory: req.body.starCategory,
    roomsInProperty: req.body.roomsInProperty,
    taxName: req.body.taxName,
    registerNumber: req.body.registerNumber,
    ratePercent: req.body.ratePercent,
    $push: {
      propertyName: {
        $each: [
          {
            propertyName: newData.propertyName,
            // Add other fields you need for the new object
            modifiedDate : time
          }
        ],
        $position: 0,
      },
    },
  };

  const options = {
    new: true, // Return the modified document
  };


  try {
    // First, update the non-array fields
   

    // Then, update the array field
    const updatedDocument = await propertyModel.findOneAndUpdate(filter, updateFields, options);

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(updatedDocument);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export { postProperty, editProperty };

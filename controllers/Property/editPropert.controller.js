import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import {
  getCurrentUTCTimestamp,
  uploadImageToS3,
  validateHotelCode,
  findUserByUserIdAndToken
} from "../../helpers/helper.js";
// import { ChainableTemporaryCredentials } from "aws-sdk";

const editProperty = async (req, res) => {

  try {
    const { userId, propertyId } = req.query
    const { country, propertyAddress1, propertyAddress2, city, state, propertyName, amenityIds, propertyEmail, propertyType, websiteUrl, baseCurrency, phone, reservationPhone, propertyRating, propertyDescription } = req.body
    const authCodeValue = req.headers['authcode'];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (!result.success) {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
    if (!propertyId) {
      return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 });
    }
    const validateHotelAndUser = await validateHotelCode(userId, propertyId)
    if (!validateHotelAndUser.success) {
      return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
    }

    const findProperty = await propertyModel.findOne({ propertyId }).lean();
    if (!findProperty) {
      return res.status(404).json({ message: "Property not found", statuscode: 404 })
    }

    if (country) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { country: country } })
    }
    if (websiteUrl) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { websiteUrl: websiteUrl } })
    }
    if (baseCurrency) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { baseCurrency: baseCurrency } })
    }
    if (phone) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { phone: phone } })
    }
    if (reservationPhone) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { reservationPhone: reservationPhone } })
    }
    if (propertyRating) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { propertyRating: propertyRating } })
    }

    var imageUrl = "";
    if (req.files['hotelImage']) {
      imageUrl = await uploadImageToS3(req.files['hotelImage'][0]);

      // Create the image object
      const imageObject = {
        hotelLogoId: Randomstring.generate(8),
        hotelLogo: imageUrl,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            hotelLogo: {
              $each: [imageObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyAddress1) {
      // Create the image object
      const propertyAddress1Object = {
        propertyAddress1: propertyAddress1,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyAddress1: {
              $each: [propertyAddress1Object],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyDescription) {
      // Create the image object
      const propertDescriptionObject = {
        propertyDescription: propertyDescription,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyDescription: {
              $each: [propertDescriptionObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyType) {
      await propertyModel.updateOne({ propertyId: propertyId }, { $set: { propertyType: propertyType } })
    }

    if (amenityIds) {
      const amenityIdsArray = amenityIds.split(',');
      const currentUTCTime = await getCurrentUTCTimestamp();
      const amenityObjects = amenityIdsArray.map((amenityId) => {
        return {
          amenityId,
        };
      });

      // Find the property document by propertyId and push the new nested amenities array at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            amenities: {
              $each: [{ amenities: amenityObjects, logId: Randomstring.generate(10) }],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyName) {
      // Create the image object
      const propertyNameObject = {
        propertyName: propertyName,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyName: {
              $each: [propertyNameObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyEmail) {
      // Create the image object
      const propertyEmailObject = {
        propertyEmail: propertyEmail,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyEmail: {
              $each: [propertyEmailObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyAddress2) {
      // Create the image object
      const propertyAddress2Object = {
        propertyAddress2: propertyAddress2,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyAddress2: {
              $each: [propertyAddress2Object],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (city) {
      // Create the image object
      const cityObject = {
        city: city,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            city: {
              $each: [cityObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (state) {
      // Create the image object
      const stateObject = {
        state: state,
        logId: Randomstring.generate(10)
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            state: {
              $each: [stateObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({ message: "Property successfully updated", statuscode: 200 })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
  }

}

export default editProperty
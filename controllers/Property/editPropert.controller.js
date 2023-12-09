import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import {
  getCurrentUTCTimestamp,
  uploadImageToS3,
  validateHotelCode,
  findUserByUserIdAndToken,
} from "../../helpers/helper.js";
import propertyLogs from "../../models/LogModels/propertyLogs.js";
// import { ChainableTemporaryCredentials } from "aws-sdk";

const editProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;
    const {
      country,
      propertyAddress1,
      propertyAddress2,
      city,
      state,
      propertyName,
      amenityIds,
      propertyEmail,
      propertyType,
      websiteUrl,
      baseCurrency,
      phone,
      reservationPhone,
      propertyRating,
      propertyDescription,
      displayStatus,
      latitude,
      longitude,
      postCode,
      deviceType,
      ipAddress,
    } = req.body;
    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (!result.success) {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
    if (!propertyId) {
      return res
        .status(400)
        .json({ message: "Please enter propertyId", statuscode: 400 });
    }
    const validateHotelAndUser = await validateHotelCode(userId, propertyId);
    if (!validateHotelAndUser.success) {
      return res.status(result.statuscode).json({
        message: "Invalid propertyId entered",
        statuscode: result.statuscode,
      });
    }

    const findProperty = await propertyModel.findOne({ propertyId }).lean();
    const currentUTCTime = await getCurrentUTCTimestamp();
    if (!findProperty) {
      return res
        .status(404)
        .json({ message: "Property not found", statuscode: 404 });
    }

    // if (country) {
    //   await propertyModel.updateOne(
    //     { propertyId: propertyId },
    //     {
    //       $set: {
    //         country: country,
    //       },
    //     },
    //     { new: true }
    //   );
    //   await propertyLogs.updateOne(
    //     { propertyId: propertyId },
    //     {
    //       $set: {
    //         country: country,
    //       },
    //     },
    //     { new: true }
    //   );
    // }
    if (websiteUrl) {
      const websiteUrlObject = {
        websiteUrl: websiteUrl,
        logId: Randomstring.generate(10),
      };
      const websiteUrlObject2 = {
        websiteUrl: websiteUrl,
        logId: websiteUrlObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            websiteUrl: {
              $each: [websiteUrlObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            websiteUrl: {
              $each: [websiteUrlObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (baseCurrency) {
      const baseCurrencyObject = {
        baseCurrency: baseCurrency,
        logId: Randomstring.generate(10),
      };
      const baseCurrencyObject2 = {
        baseCurrency: baseCurrency,
        logId: baseCurrencyObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            baseCurrency: {
              $each: [baseCurrencyObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            baseCurrency: {
              $each: [baseCurrencyObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (phone) {
      const phoneObject = {
        phone: phone,
        logId: Randomstring.generate(10),
      };
      const phoneObject2 = {
        phone: phone,
        logId: phoneObject.phone,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            phone: {
              $each: [phoneObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            phone: {
              $each: [phoneObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (reservationPhone) {
      const reservationPhoneObject = {
        reservationPhone: reservationPhone,
        logId: Randomstring.generate(10),
      };
      const reservationPhoneObject2 = {
        reservationPhone: reservationPhone,
        logId: reservationPhoneObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            reservationPhone: {
              $each: [reservationPhoneObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            reservationPhone: {
              $each: [reservationPhoneObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (propertyRating) {
      const propertyRatingObject = {
        propertyRating: propertyRating,
        logId: Randomstring.generate(10),
      };
      const propertyRatingObject2 = {
        propertyRating: propertyRating,
        logId: propertyRatingObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyRating: {
              $each: [propertyRatingObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyRating: {
              $each: [propertyRatingObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    var imageUrl = "";
    if (req.files["hotelImage"]) {
      imageUrl = await uploadImageToS3(req.files["hotelImage"][0]);

      // Create the image object
      const imageObject = {
        hotelLogoId: Randomstring.generate(8),
        hotelLogo: imageUrl,
        logId: Randomstring.generate(10),
      };
      const imageObject2 = {
        hotelLogoId: imageObject.hotelLogoId,
        hotelLogo: imageUrl,
        logId: imageObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            hotelLogo: {
              $each: [imageObject2],
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
        logId: Randomstring.generate(10),
      };
      const propertyAddress1Object2 = {
        propertyAddress1: propertyAddress1,
        logId: propertyAddress1Object.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyAddress1: {
              $each: [propertyAddress1Object2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyDescription) {
      const propertDescriptionObject = {
        propertyDescription: propertyDescription,
        logId: Randomstring.generate(10),
      };
      const propertDescriptionObject2 = {
        propertyDescription: propertyDescription,
        logId: propertDescriptionObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyDescription: {
              $each: [propertDescriptionObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyType) {
      const propertyTypeObject = {
        propertyType: propertyType,
        logId: Randomstring.generate(10),
      };
      const propertyTypeObject2 = {
        propertyType: propertyType,
        logId: propertyTypeObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };
      await propertyModel.updateOne(
        { propertyId: propertyId },
        {
          $push: {
            propertyType: {
              $each: [propertyTypeObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.updateOne(
        { propertyId: propertyId },
        {
          $push: {
            propertyType: {
              $each: [propertyTypeObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    let amenityObjects = [];
    if (req.body.amenityIds && typeof req.body.amenityIds === "string") {
      const amenityIdsArray = req.body.amenityIds.split(",");
      const currentUTCTime = await getCurrentUTCTimestamp();
      amenityObjects = amenityIdsArray.map((amenityId) => {
        return {
          amenityId,
          addedDate: currentUTCTime,
        };
      });

      // Find the property document by propertyId and push the new nested amenities array at position 0
      const logId = Randomstring.generate(10);
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            amenities: {
              $each: [{ amenities: amenityObjects, logId: logId }],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            amenities: {
              $each: [
                {
                  amenities: amenityObjects,
                  logId: logId,
                  userId: userId,
                  deviceType: deviceType,
                  ipAddress: ipAddress,
                  modifiedOn: currentUTCTime,
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (propertyName) {
      const propertyNameObject = {
        propertyName: propertyName,
        logId: Randomstring.generate(10),
      };
      const propertyNameObject2 = {
        propertyName: propertyName,
        logId: propertyNameObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyName: {
              $each: [propertyNameObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (postCode) {
      const postCodeObject = {
        postCode: postCode,
        logId: Randomstring.generate(10),
      };
      const postCodeObject2 = {
        postCode: postCode,
        logId: postCodeObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            postCode: {
              $each: [postCodeObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            postCode: {
              $each: [postCodeObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (displayStatus) {
      const displayStatusObject = {
        displayStatus: displayStatus,
        logId: Randomstring.generate(10),
      };
      const displayStatusObject2 = {
        displayStatus: displayStatus,
        logId: displayStatusObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

      // Find the propertyImage document by propertyId and push the new image object at position 0
      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            displayStatus: {
              $each: [displayStatusObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            displayStatus: {
              $each: [displayStatusObject2],
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
        logId: Randomstring.generate(10),
      };
      const propertyEmailObject2 = {
        propertyEmail: propertyEmail,
        logId: propertyEmailObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyEmail: {
              $each: [propertyEmailObject2],
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
        logId: Randomstring.generate(10),
      };
      const propertyAddress2Object2 = {
        propertyAddress2: propertyAddress2,
        logId: propertyAddress2Object.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            propertyAddress2: {
              $each: [propertyAddress2Object2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (city) {
      const cityObject = {
        city: city,
        logId: Randomstring.generate(10),
      };

      const cityObject2 = {
        city: city,
        logId: cityObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            city: {
              $each: [cityObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }
    if (latitude && longitude) {
      const locationObject = {
        latitude: latitude,
        longitude: longitude,
        logId: Randomstring.generate(10),
      };
      const locationObject2 = {
        latitude: latitude,
        longitude: longitude,
        logId: locationObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

      await propertyModel.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            location: {
              $each: [locationObject],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            location: {
              $each: [locationObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    if (state) {
      const stateObject = {
        state: state,
        logId: Randomstring.generate(10),
      };
      const stateObject2 = {
        state: state,
        logId: stateObject.logId,
        deviceType: deviceType,
        userId: userId,
        ipAddress: ipAddress,
        modifiedOn: currentUTCTime,
      };

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
      await propertyLogs.findOneAndUpdate(
        { propertyId: propertyId },
        {
          $push: {
            state: {
              $each: [stateObject2],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "Property successfully updated", statuscode: 200 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default editProperty;

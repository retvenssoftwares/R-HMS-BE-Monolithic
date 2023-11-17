import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import amenityModel from "../../models/amenity.js";
import amenitiesLog from "../../models/LogModels/aminitiesLogs.js";
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
} from "../../helpers/helper.js";

const postAmenity = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      amenityName,
      propertyId,
      amenityType,
      amenityIcon,
      amenityIconLink,
      deviceType,
      ipAddress
    } = req.body;
    const authCodeValue = req.headers["authcode"];
    const findUser = await verifiedUser.findOne({ userId: userId });
    const currentUTCTime = await getCurrentUTCTimestamp();

    if (!findUser || !userId) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userId", statuscode: 404 });
    }
    let userRole = findUser.role[0].role;
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success) {
      const newAmenity = new amenityModel({
        propertyId,
        createdBy: userRole,
        createdOn: currentUTCTime,
        modifiedBy: [],
        modifiedOn: [],
        amenityId: Randomstring.generate(8),
        amenityName: [
          {
            amenityName: amenityName,
            logId: Randomstring.generate(10),
          },
        ],
        shortCode: [
          {
            shortCode: shortCode,
            logId: Randomstring.generate(10),
          },
        ],

        amenityType: [
          {
            amenityType: amenityType,
            logId: Randomstring.generate(10),
          },
        ],
        amenityIcon: [
          {
            amenityIcon: amenityIcon,
            logId: Randomstring.generate(10),
          },
        ],
        amenityIconLink: [
          {
            amenityIconLink,
            logId: Randomstring.generate(10),
          },
        ],
      });
      const savedAminity = await newAmenity.save();

      //save data in logs model
      const addAmenityLogs = new amenitiesLog({
        userId: savedAminity.userId,
        amenityId: savedAminity.amenityId,
        createdBy: savedAminity.createdBy,
        createdOn: savedAminity.createdOn,
        propertyId: savedAminity.propertyId,
        shortCode: [
          {
            logId: savedAminity.shortCode[0].logId,
            shortCode: savedAminity.shortCode[0].shortCode,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        amenityName: [
          {
            logId: savedAminity.amenityName[0].logId,
            amenityName: savedAminity.amenityName[0].amenityName,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        amenityType: [
          {
            logId: savedAminity.amenityType[0].logId,
            amenityType: savedAminity.amenityType[0].amenityType,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        amenityIcon: [
          {
            logId: savedAminity.amenityIcon[0].logId,
            amenityIcon: savedAminity.amenityIcon[0].amenityIcon,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        amenityIconLink: [
          {
            logId: savedAminity.amenityIconLink[0].logId,
            amenityIconLink: savedAminity.amenityIconLink[0].amenityIconLink,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
      });
      await addAmenityLogs.save();

      return res
        .status(200)
        .json({ message: "New amenity added successfully", statuscode: 200 });
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postAmenity;

import Randomstring from "randomstring";
import requestIp from "request-ip"
import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import roomModelLogs from "../../models/LogModels/roomTypeLogs.js"
import userModel from "../../models/verifiedUsers.js";
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadMultipleImagesToS3,
  findUserByUserIdAndToken
} from "../../helpers/helper.js";

const patchRoom = async (req,res)=>{
    try{
        const {
            userId,
            baseAdult,
            baseChild,
            shortCode,
            roomDescription,
            roomTypeName,
            maxAdult,
            maxChild,
            maxOccupancy,
            baseRate,
            minimumRate,
            maximumRate,
            extraAdultRate,
            extraChildRate,
            noOfBeds,
            deviceType, 
            displayStatus,
          } = req.body;

          const roomTypeId = req.params.roomTypeId;
          const authCodeValue = req.headers['authcode'];
          const findUser = await userModel.findOne({ userId });
          if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if(result.success){
        const findRoomType = await roomModel.findOne({ roomTypeId });

        const logRoomType = await roomModelLogs.findOne({ roomTypeId });

        if (!findRoomType || !roomTypeId) {
            return res.status(404).json({ message: "roomType not found", statuscode: 404 });
        }

        
       // Amenities
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
       }

      // BedType
let bedTypeObjects = [];
if (req.body.bedTypeIds && typeof req.body.bedTypeIds === "string") {
  const bedTypeIdsArray = req.body.bedTypeIds.split(",");
  bedTypeObjects = bedTypeIdsArray.map((bedTypeId) => {
    return {
      bedTypeId,
    };
  });
}
        

          // Update the roomType fields
          if (shortCode) {
            findRoomType.shortCode.unshift({ shortCode, logId:Randomstring.generate(10) });
        }
        if (roomDescription) {
            findRoomType.roomDescription.unshift({ roomDescription, logId:Randomstring.generate(10)});
        }
        if (bedTypeObjects.length > 0) {
            findRoomType.bedType.unshift({
              bedType: bedTypeObjects,
              logId: Randomstring.generate(10),
            });
          }
        if (roomTypeName) {
            findRoomType.roomTypeName.unshift({ roomTypeName, logId:Randomstring.generate(10) });
        }
        if (baseAdult) {
            findRoomType.baseAdult.unshift({ baseAdult, logId:Randomstring.generate(10) });
        }
        if (baseChild) {
            findRoomType.baseChild.unshift({ baseChild, logId:Randomstring.generate(10)});
        }
        if (maxAdult) {
            findRoomType.maxAdult.unshift({ maxAdult, logId:Randomstring.generate(10) });
        }
        if (maxChild) {
            findRoomType.maxChild.unshift({ maxChild,logId:Randomstring.generate(10) });
        }
        if (maxOccupancy) {
            findRoomType.maxOccupancy.unshift({ maxOccupancy, logId:Randomstring.generate(10) });
        }
        if (baseRate) {
            findRoomType.baseRate.unshift({ baseRate,  logId:Randomstring.generate(10) });
        }
        if (minimumRate) {
            findRoomType.minimumRate.unshift({ minimumRate, logId:Randomstring.generate(10) });
        }
        if (maximumRate) {
            findRoomType.maximumRate.unshift({ maximumRate, logId:Randomstring.generate(10) });
        }
        if (extraAdultRate) {
            findRoomType.extraAdultRate.unshift({ extraAdultRate, logId:Randomstring.generate(10) });
        }
        if (extraChildRate) {
            findRoomType.extraChildRate.unshift({ extraChildRate, logId:Randomstring.generate(10) });
        }
        if (displayStatus) {
            findRoomType.displayStatus.unshift({ displayStatus, logId:Randomstring.generate(10) });
        }
        if (noOfBeds) {
            findRoomType.noOfBeds.unshift({ noOfBeds, logId:Randomstring.generate(10) });
        }
        if (amenityObjects.length > 0) {
            findRoomType.amenities.unshift({
              amenities: amenityObjects,
              logId: Randomstring.generate(10),
            });
          }
        // Save the updated document
        const updatedRoom = await findRoomType.save();

        res.status(200).json({ message: "Room updated successfully", statuscode: 200 });

    }
    else{
        return res.status(result.statuscode).json({ message: result.message });

    }
}

    catch(err){
        console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });

    }


}
export default patchRoom
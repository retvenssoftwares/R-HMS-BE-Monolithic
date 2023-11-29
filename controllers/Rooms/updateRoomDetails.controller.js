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
            ipAddress
          } = req.body;

          const roomTypeId = req.params.roomTypeId;
          const authCodeValue = req.headers['authcode'];
          const findUser = await userModel.findOne({ userId : userId });
          if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const currentUTCTime = await getCurrentUTCTimestamp();
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
            const logId = Randomstring.generate(10);            
            findRoomType.shortCode.unshift({ shortCode, logId });
            
            const shortCodeObject = {
              shortCode: shortCode,
              logId: logId,
              userId: userId,
              deviceType: deviceType,
              ipAddress: ipAddress,
              modifiedOn:currentUTCTime
            };
            
            logRoomType.shortCode.unshift(shortCodeObject);            
          }
          
        if (roomDescription) {
            const logId = Randomstring.generate(10);            
            findRoomType.roomDescription.unshift({ roomDescription, logId });
            const roomDescriptionObject={
                roomDescription: roomDescription,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.roomDescription.unshift(roomDescriptionObject);
        }
        if (bedTypeObjects.length > 0) {
            const logId = Randomstring.generate(10);
            findRoomType.bedType.unshift({
              bedType: bedTypeObjects,
              logId: logId,
            });
            const bedTypeObject={
                bedType: bedTypeObjects,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.bedType.unshift(bedTypeObject);
          }
        if (roomTypeName) {
            const logId = Randomstring.generate(10);
            findRoomType.roomTypeName.unshift({ roomTypeName, logId});
            const roomTypeNameObject={
                roomTypeName: roomTypeName,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.roomTypeName.unshift(roomTypeNameObject);
        }
        if (baseAdult) {
            const logId = Randomstring.generate(10);
            findRoomType.baseAdult.unshift({ baseAdult, logId});
            const baseAdultObject={
                baseAdult: baseAdult,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.baseAdult.unshift(baseAdultObject);
        }
        if (baseChild) {
            const logId = Randomstring.generate(10);
            findRoomType.baseChild.unshift({ baseChild, logId});
            const baseChildObject={
                baseChild: baseChild,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.baseChild.unshift(baseChildObject);
        }
        if (maxAdult) {
            const logId = Randomstring.generate(10);
            findRoomType.maxAdult.unshift({ maxAdult, logId});
            const maxAdultObject={
                maxAdult: maxAdult,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.maxAdult.unshift(maxAdultObject);
        }
        if (maxChild) {
            const logId = Randomstring.generate(10);
            findRoomType.maxChild.unshift({ maxChild,logId });
            const maxChildObject={
                maxChild: maxChild,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.maxChild.unshift(maxChildObject);
        }
        if (maxOccupancy) {
            const logId = Randomstring.generate(10);
            findRoomType.maxOccupancy.unshift({ maxOccupancy, logId});
            const maxOccupancyObject={
                maxOccupancy: maxOccupancy,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.maxOccupancy.unshift(maxOccupancyObject);
        }
        if (baseRate) {
            const logId = Randomstring.generate(10);
            findRoomType.baseRate.unshift({ baseRate,  logId });
            const baseRateObject={
                baseRate: baseRate,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.baseRate.unshift(baseRateObject);
        }
        if (minimumRate) {
            const logId = Randomstring.generate(10);
            findRoomType.minimumRate.unshift({ minimumRate, logId});
            const minimumRateObject={
                minimumRate: minimumRate,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.minimumRate.unshift(minimumRateObject);
        }
        if (maximumRate) {
            const logId = Randomstring.generate(10);
            findRoomType.maximumRate.unshift({ maximumRate, logId});
            const maximumRateObject={
                maximumRate: maximumRate,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.maximumRate.unshift(maximumRateObject);
        }
        if (extraAdultRate) {
            const logId = Randomstring.generate(10);
            findRoomType.extraAdultRate.unshift({ extraAdultRate, logId });
            const extraAdultRateObject={
                extraAdultRate: extraAdultRate,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.extraAdultRate.unshift(extraAdultRateObject);
        }
        if (extraChildRate) {
            const logId = Randomstring.generate(10);
            findRoomType.extraChildRate.unshift({ extraChildRate, logId });
            const extraChildRateObject={
                extraChildRate: extraChildRate,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.extraChildRate.unshift(extraChildRateObject);
        }
        if (displayStatus) {
            const logId = Randomstring.generate(10);
            findRoomType.displayStatus.unshift({ displayStatus, logId});
            const displayStatusObject={
                displayStatus: displayStatus,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.displayStatus.unshift(displayStatusObject);
        }
        if (noOfBeds) {
            const logId = Randomstring.generate(10);
            findRoomType.noOfBeds.unshift({ noOfBeds, logId });
            const noOfBedsObject={
                noOfBeds: noOfBeds,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.noOfBeds.unshift(noOfBedsObject);
        }
        if (amenityObjects.length > 0) {
            const logId = Randomstring.generate(10);
            findRoomType.amenities.unshift({
              amenities: amenityObjects,
              logId: logId
            });
            const amenitiesObject={
                amenities: amenityObjects,
                logId:logId,
                userId:userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime
            }
            logRoomType.amenities.unshift(amenitiesObject);
          }
        // Save the updated document
        const updatedRoom = await findRoomType.save();
        logRoomType.save();

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
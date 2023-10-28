  import Randomstring from "randomstring";
  import requestIp from "request-ip"
  import * as dotenv from "dotenv";
  dotenv.config();
  import roomModel from "../../models/roomType.js";
  import roomModelLogs from "../../models/LogModels/roomTypeLogs.js"
  import roomImageModel from "../../models/roomTypeImages.js";
  import userModel from "../../models/verifiedUsers.js";
  import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
    uploadMultipleImagesToS3
  } from "../../helpers/helper.js";

  //upload Room controller
  const postRoom = async (req, res) => {
    try {
      const {
        userId,
        roomTypeId,
        propertyId,
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
      } = req.body;
      
      const authCodeValue = req.headers['authcode']

      const user = await userModel.findOne({userId:req.body.userId})
      if(!user){
        return res.status(404).json({message:"user not found"})
      }
      const {authCode}= user
      // console.log(authCode)

      if(authCodeValue!==authCode){
        return res.status(404).json({message:"invalid authCode"})
      }

      let userRole = user.role[0].role;
      const amenityIds = req.body.amenityIds;
      const amenityIdsArray = amenityIds.split(',');
      const currentUTCTime = await getCurrentUTCTimestamp();
      const amenityObjects = amenityIdsArray.map((amenityId) => {
        return {
          amenityId,
          addedDate: currentUTCTime,
        };
      });
  
      //bedType
      const bedTypeIds= req.body.bedTypeIds;
      const bedTypeIdsArray = bedTypeIds.split(',');
      const bedTypeObjects = bedTypeIdsArray.map((bedTypeId) => {
        return {
          bedTypeId,
        };
      });


    const roomId =Randomstring.generate(8)
      //create record
      const newRoom = new roomModel({
        userId,
        propertyId,
        roomTypeId: roomId,
        shortCode: [
          {
            shortCode,
            logId: Randomstring.generate(10),
          },
        ],
        baseAdult: [
          {
            baseAdult,
            logId: Randomstring.generate(10),
          },
        ],
        baseChild: [
          {
            baseChild,
            logId: Randomstring.generate(10),
          },
        ],
        roomDescription: [
          {
            roomDescription,
            logId: Randomstring.generate(10),
          },
        ],
        noOfBeds:[{
          noOfBeds,
          logId: Randomstring.generate(10),
        }],

        bedType: [{
          bedType:bedTypeObjects,
          logId: Randomstring.generate(10),
      }],


        roomTypeName: [
          {
            roomTypeName: roomTypeName,
            logId: Randomstring.generate(10),
          },
        ],
        maxAdult: [
          {
            maxAdult: maxAdult,
            logId: Randomstring.generate(10),
          },
        ],
        maxChild: [
          {
            maxChild: maxChild,
            logId: Randomstring.generate(10),
          },
        ],
        maxOccupancy: [
          {
            maxOccupancy:maxOccupancy,
            logId: Randomstring.generate(10),
          },
        ],
        baseRate: [
          {
            baseRate: baseRate,
            logId: Randomstring.generate(10),
          },
        ],
        minimumRate: [
          {
            minimumRate: minimumRate,
            logId: Randomstring.generate(10),
          },
        ],
        maximumRate: [
          {
            maximumRate: maximumRate,
            logId: Randomstring.generate(10),
          },
        ],
        extraAdultRate: [
          {
            extraAdultRate: extraAdultRate,
            logId: Randomstring.generate(10),
          },
        ],
        extraChildRate: [
          {
            extraChildRate: extraChildRate,
            logId: Randomstring.generate(10),
          },
        ],
        amenities: [
          {
            amenities: amenityObjects,
            logId: Randomstring.generate(10),
          },
        ],
        dateUTC: currentUTCTime,
        dateLocal: getCurrentLocalTimestamp(),
        createdBy:userRole,
        createdOn:currentUTCTime
        
      });

    
      // Save the Room record
      const savedRoom = await newRoom.save();

      // Create a roomImage record and associate it with the room
      const roomImages = new roomImageModel({
        roomTypeId: savedRoom.roomTypeId, 
        propertyId:savedRoom.propertyId,
      });
      // Save the propertyImages record
      await roomImages.save();


      //save data in logs model
      const addRoomLogs = new roomModelLogs({
        userId:savedRoom.userId,
        createdBy:savedRoom.createdBy,
        createdOn:savedRoom.createdOn,
        propertyId:savedRoom.propertyId,
        roomTypeId: roomId,
        shortCode:[{
          logId: savedRoom.shortCode[0].logId,
          shortCode: savedRoom.shortCode[0].shortCode,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        baseAdult:[{
          logId: savedRoom.baseAdult[0].logId,
          baseAdult: savedRoom.baseAdult[0].baseAdult,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        baseChild:[{
          logId: savedRoom.baseChild[0].logId,
          baseChild: savedRoom.baseChild[0].baseChild,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        roomDescription:[{
          logId: savedRoom.roomDescription[0].logId,
          roomDescription: savedRoom.roomDescription[0].roomDescription,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        noOfBeds:[{
          logId: savedRoom.noOfBeds[0].logId,
          noOfBeds: savedRoom.noOfBeds[0].noOfBeds,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        bedType:[{
          logId: savedRoom.bedType[0].logId,
          bedType: savedRoom.bedType[0].bedType,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        roomTypeName:[{
          logId: savedRoom.roomTypeName[0].logId,
          roomTypeName: savedRoom.roomTypeName[0].roomTypeName,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        maxAdult:[{
          logId: savedRoom.maxAdult[0].logId,
          maxAdult: savedRoom.maxAdult[0].maxAdult,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        maxChild:[{
          logId: savedRoom.maxChild[0].logId,
          maxChild: savedRoom.maxChild[0].maxChild,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        maxOccupancy:[{
          logId: savedRoom.maxOccupancy[0].logId,
          maxOccupancy: savedRoom.maxOccupancy[0].maxOccupancy,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        baseRate:[{
          logId: savedRoom.baseRate[0].logId,
          baseRate: savedRoom.baseRate[0].baseRate,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        minimumRate:[{
          logId: savedRoom.minimumRate[0].logId,
          minimumRate: savedRoom.minimumRate[0].minimumRate,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        maximumRate:[{
          logId: savedRoom.maximumRate[0].logId,
          maximumRate: savedRoom.maximumRate[0].maximumRate,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        extraAdultRate:[{
          logId: savedRoom.extraAdultRate[0].logId,
          extraAdultRate: savedRoom.extraAdultRate[0].extraAdultRate,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
        extraChildRate:[{
          logId: savedRoom.extraChildRate[0].logId,
          extraChildRate: savedRoom.extraChildRate[0].extraChildRate,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],

        amenities:[{
          logId: savedRoom.amenities[0].logId,
          amenities: savedRoom.amenities[0].amenities,
          userId: userId,
          deviceType: deviceType,
          modifiedOn: currentUTCTime,
        }],
      
      });

      await addRoomLogs.save();


      return res.status(200).json({ message: "New room added successfully", statuscode: 200 });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
  };
  export default postRoom;

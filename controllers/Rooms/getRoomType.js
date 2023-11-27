import * as dotenv from "dotenv";
dotenv.config();
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getRoomType = async (req, res)=>{
     try{
        const { propertyId, userId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }
            const room = await roomTypeModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1"  });
            if (room.length > 0) {
                const roomProperties = room.map(room => {
                 
                    const roomTypeId = room.roomTypeId || '';
                    const firstRoomTypeName = room.roomTypeName[0].roomTypeName;
                    const firstNumberOfRooms = room.numberOfRooms[0].numberOfRooms

                    return {

                        roomTypeId: roomTypeId,
                        roomTypeName: firstRoomTypeName,
                        numberOfRooms: firstNumberOfRooms
                    };
            });
            return res.status(200).json({ data: roomProperties, statuscode: 200 });
            }else {
                return res.status(200).json({ message: "No property found", statuscode: 200 });
            }

        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
          }
     }catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};
export default getRoomType;
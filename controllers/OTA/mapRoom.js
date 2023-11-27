import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import roomTypeModel from '../../models/roomType.js';
import ota from "../../models/superAdmin/otaModel.js";
import channelLogsModel from "../../models/OTAs/channelLogs.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";

const mapRoomData = async (req, res) => {

    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, otaRoomTypeCode, roomTypeId, connectionId } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId }).lean();
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }
        const getOTAName = await ota.findOne({ "otaId.0.otaId": otaId }).select('otaId otaName')
        if (!getOTAName) {
            return res.status(404).json({ message: "Invalid otaId entered", statuscode: 404 });
        }
        const getRoomName = await roomTypeModel.findOne({ roomTypeId: roomTypeId }, 'roomTypeName').lean();
        const roomName = getRoomName.roomTypeName[0].roomTypeName || "";

        await roomAndRateMap.findOneAndUpdate(
            { otaId: otaId, connectionId: connectionId },
            { $push: { mappedOTARoomData: { otaRoomTypeCode: otaRoomTypeCode, roomTypeId: roomTypeId } } }, // The update operation using $push
            { new: true })

        const logObject = {
            userId: userId,
            roomTypeId: roomTypeId,
            otaRoomTypeCode: otaRoomTypeCode,
            addedOn: await getCurrentUTCTimestamp(),
            logHeading: `${roomName} mapped`,
            logDescription: `${roomName} mapped with ${getOTAName.otaName[0].otaName || ""}`
        };

        await channelLogsModel.findOneAndUpdate(
            { propertyId: propertyId, otaId: otaId },
            {
                $push: {
                    channelLogs: {
                        $each: [logObject],
                        $position: 0
                    }
                }
            },
            { new: true, upsert: true }
        );
        return res.status(200).json({ message: "Room mapped successfully", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default mapRoomData;
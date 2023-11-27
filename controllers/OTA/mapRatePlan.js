import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import barRatePlanModel from "../../models/barRatePlan.js";
import channelLogsModel from "../../models/OTAs/channelLogs.js";
import ota from "../../models/superAdmin/otaModel.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";

const mapRateData = async (req, res) => {

    try {
        const { userId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, propertyId, otaRoomTypeCode, roomTypeId, ratePlanId, otaRatePlanCode, connectionId } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId }).lean();
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }
        const getOTAName = await ota.findOne({ otaId }).select('otaId otaName')
        if (!getOTAName) {
            return res.status(404).json({ message: "Invalid otaId entered", statuscode: 404 });
        }
        const getBarRateName = await barRatePlanModel.findOne({ barRatePlanId: ratePlanId }).select('ratePlanName barRatePlanId');
        if (!getBarRateName) {
            return res.status(404).json({ message: "Invalid ratePlanId entered", statuscode: 404 });
        }
        await roomAndRateMap.findOneAndUpdate(
            { otaId: otaId, connectionId: connectionId },
            { $push: { mappedRatePlanData: { otaRoomTypeCode: otaRoomTypeCode, roomTypeId: roomTypeId, ratePlanId: ratePlanId, otaRatePlanCode: otaRatePlanCode } } }, // The update operation using $push
            { new: true })

        const logObject = {
            userId: userId,
            roomTypeId: roomTypeId,
            ratePlanId: ratePlanId,
            deviceType: deviceType,
            ipAddress: ipAddress,
            addedOn: await getCurrentUTCTimestamp(),
            logHeading: `${getBarRateName.ratePlanName[0].ratePlanName || ""} mapped`,
            logDescription: `${getBarRateName.ratePlanName[0].ratePlanName || ""} mapped with ${getOTAName.otaName[0].otaName || ""}`
        }
        channelLogsModel.findOneAndUpdate(
            { propertyId: propertyId, otaId: otaId },
            {
                $push: {
                    channelLogs: logObject
                }
            },
            { new: true, upsert: true }, // Set `new` to true to return the modified document, and `upsert` to true to create the document if it doesn't exist
            (err, result) => {
                if (err) {
                    console.error('Error updating document:', err);
                    // Handle the error
                } else {
                    console.log('Updated document:', result);
                    // Handle the result
                }
            }
        );
        return res.status(200).json({ message: "Rate mapped successfully", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default mapRateData;
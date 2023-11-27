import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import barRatePlanModel from "../../models/barRatePlan.js";
import channelLogsModel from "../../models/OTAs/channelLogs.js";
import ota from "../../models/superAdmin/otaModel.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";

const mapRateData = async (req, res) => {

    try {
        const { userId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, propertyId, otaRoomTypeCode, roomTypeId, ratePlanId, otaRatePlanCode, connectionId, deviceType, ipAddress } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId: otaId }).lean();
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }
        const getOTAName = await ota.findOne({ "otaId.0.otaId": otaId }).select('otaId otaName')
        if (!getOTAName) {
            return res.status(404).json({ message: "Invalid otaId entered", statuscode: 404 });
        }
        console.log(getOTAName.otaName, "Dsgfa")
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
            otaRoomTypeCode: otaRoomTypeCode,
            otaRatePlanCode: otaRatePlanCode,
            addedOn: await getCurrentUTCTimestamp(),
            logHeading: `${getBarRateName.ratePlanName[0].ratePlanName || ""} mapped`,
            logDescription: `${getBarRateName.ratePlanName[0].ratePlanName || ""} mapped with ${getOTAName.otaName[0].otaName || ""}`
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
        return res.status(200).json({ message: "Rateplan mapped successfully", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default mapRateData;
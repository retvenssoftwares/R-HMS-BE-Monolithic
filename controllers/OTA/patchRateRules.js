import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import channelLogsModel from "../../models/OTAs/channelLogs.js";
import barRatePlanModel from "../../models/barRatePlan.js";
import ota from "../../models/superAdmin/otaModel.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";

const rateRuleUpdate = async (req, res) => {

    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, changeType, rateRuleType, adjustmentValue, otaRatePlanCode, otaRoomTypeCode, connectionId, ratePlanId, roomTypeId } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        if (!propertyId) {
            return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId, connectionId: connectionId })
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }

        const getBarRateName = await barRatePlanModel.findOne({ barRatePlanId: ratePlanId }).select('ratePlanName barRatePlanId');
        if (!getBarRateName) {
            return res.status(404).json({ message: "Invalid ratePlanId entered", statuscode: 404 });
        }
        const getOTAName = await ota.findOne({ "otaId.0.otaId": otaId }).select('otaId otaName')
        if (!getOTAName) {
            return res.status(404).json({ message: "Invalid otaId entered", statuscode: 404 });
        }

        const existingEntryIndex = findRecord.mappedRatePlanData.findIndex(
            (entry) => entry.otaRatePlanCode === otaRatePlanCode
        );

        if (existingEntryIndex === -1) {
            return res.status(400).json({ message: "Invalid ratePlanCode", statuscode: "400" });
        }

        // Create a new rate rule object
        const newRateRule = {
            rateRuleType: rateRuleType,
            changeType: changeType,
            adjustmentValue: adjustmentValue
        };

        // Push the new rate rule object to the rateRule array of the existing entry
        findRecord.mappedRatePlanData[existingEntryIndex].rateRule.unshift(newRateRule);

        // Save the updated record
        await findRecord.save();
        const logObject = {
            userId: userId,
            roomTypeId: roomTypeId,
            ratePlanId: ratePlanId,
            otaRoomTypeCode: otaRoomTypeCode,
            otaRatePlanCode: otaRatePlanCode,
            addedOn: await getCurrentUTCTimestamp(),
            logHeading: `${getBarRateName.ratePlanName[0].ratePlanName || ""} raterule changed`,
            logDescription: `${getBarRateName.ratePlanName[0].ratePlanName || ""} raterule changed for ${getOTAName.otaName[0].otaName || ""}`
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
        return res.status(200).json({ message: "Rate rule successfully updated", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default rateRuleUpdate;
import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const rateRuleUpdate = async (req, res) => {

    try {
        const { userId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, changeType, rateRuleType, adjustmentValue, otaRatePlanCode } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId })
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }
        // const temp = findRecord.mappedRatePlanData
        // console.log(temp)

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

        return res.status(200).json({ message: "Rate rule successfully updated", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default rateRuleUpdate;
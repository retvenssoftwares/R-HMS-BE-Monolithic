import barRatePlan from "../../models/barRatePlan.js"
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getRatePlansList = async (req, res) => {
    try {
        const { roomTypeId, userId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const findRatePlans = await barRatePlan.find({ "roomType.roomTypeId": roomTypeId }).select("ratePlanName propertyId barRatePlanId roomType").lean();

            if (findRatePlans.length > 0) {
                const foundRateData = findRatePlans.map((rateData) => {
                    return {
                        ...rateData._doc,
                        propertyId: rateData.propertyId || "",
                        roomTypeId: roomTypeId || '',
                        barRatePlanId: rateData.barRatePlanId || "",
                        ratePlanName: rateData.ratePlanName[0].ratePlanName || ''
                    }
                })
                return res.status(200).json({ data: foundRateData, statuscode: 200 });

            } else {
                return res.status(404).json({ message: "No rooms found", status: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};

export default getRatePlansList;

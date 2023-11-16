import barRatePlan from "../../models/barRatePlan.js"
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getRatePlansList = async (req, res) => {
    try {
        const { roomTypeId, userId } = req.query;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const findRatePlans = await barRatePlan.find({ "roomType.roomTypeId": roomTypeId })
                .select("ratePlanName propertyId barRatePlanId roomType barRates")
                .lean();

            if (findRatePlans.length > 0) {
                const foundRateData = await Promise.all(findRatePlans.map(async (rateData) => {
                    const roomTypeName = await roomTypeModel.findOne({ roomTypeId: roomTypeId }).select('roomTypeName');

                    const barRates = rateData.barRates || {};
                    const ratePlanTotal = (barRates.ratePlanTotal && barRates.ratePlanTotal[0].ratePlanTotal) || '';
                    const extraChildRate = (barRates.extraChildRate && barRates.extraChildRate[0].extraChildRate) || '';
                    const extraAdultRate = (barRates.extraAdultRate && barRates.extraAdultRate[0].extraAdultRate) || '';
                    const ratePlanName = rateData.ratePlanName.length > 0 ? rateData.ratePlanName[0].ratePlanName : '';
                    return {
                        ...rateData._doc,
                        propertyId: rateData.propertyId || "",
                        roomTypeId: roomTypeId || '',
                        roomTypeName: roomTypeName.roomTypeName[0].roomTypeName || '',
                        barRatePlanId: rateData.barRatePlanId || "",
                        ratePlanTotal,
                        extraChildRate,
                        extraAdultRate,
                        ratePlanName
                    };
                }));
                return res.status(200).json({ data: foundRateData, statuscode: 200 });

            } else {
                return res.status(200).json({ message: "No rateplans found", status: 200 });
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


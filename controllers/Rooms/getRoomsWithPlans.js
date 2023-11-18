import barRatePlan from "../../models/barRatePlan.js"
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getRatePlansListWithRooms = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {

            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }
            const findRatePlans = await barRatePlan.find({ propertyId: propertyId })
                .select("ratePlanName propertyId barRatePlanId roomType barRates")
                .lean();

            if (findRatePlans.length > 0) {
                const foundRateData = await Promise.all(findRatePlans.map(async (rateData) => {
                    // console.log(rateData.roomType[0].roomTypeId, "ids")
                    const roomTypeName = await roomTypeModel.findOne({ roomTypeId: rateData.roomType[0].roomTypeId }).select('roomTypeName roomTypeId');

                    const barRates = rateData.barRates || {};
                    const ratePlanTotal = (barRates.ratePlanTotal && barRates.ratePlanTotal[0].ratePlanTotal) || '';
                    const ratePlanName = rateData.ratePlanName.length > 0 ? rateData.ratePlanName[0].ratePlanName : '';
                    return {
                        ...rateData._doc,
                        propertyId: rateData.propertyId || "",
                        roomTypeId: roomTypeName.roomTypeId || '',
                        roomTypeName: roomTypeName.roomTypeName[0].roomTypeName || '',
                        barRatePlanId: rateData.barRatePlanId || "",
                        ratePlanTotal,
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

export default getRatePlansListWithRooms;


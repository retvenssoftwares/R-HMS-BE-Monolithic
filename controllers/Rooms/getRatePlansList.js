import barRatePlan from "../../models/barRatePlan.js"
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getRatePlansList = async (req, res) => {
    try {
        const { roomTypeId, userId } = req.query;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const findRatePlans = await barRatePlan.find({ "roomType.roomTypeId": roomTypeId,"displayStatus.0.displayStatus":"1" })
                .select("ratePlanName propertyId barRatePlanId roomType barRates inclusion").sort({_id:-1}).lean();

            if (findRatePlans.length > 0) {
                const foundRateData = await Promise.all(findRatePlans.map(async (rateData) => {
                    const roomTypeName = await roomTypeModel.findOne({ roomTypeId: roomTypeId }).select('roomTypeName').sort({_id:-1}).lean();

                    const barRates = rateData.barRates || '';
                    const inclusionArray = rateData.inclusion[0] || '';
                   // console.log(inclusionArray)
                    const ratePlanTotal = (barRates.ratePlanTotal && barRates.ratePlanTotal[0].ratePlanTotal) || '';
                    const extraChildRate = (barRates.extraChildRate && barRates.extraChildRate[0].extraChildRate) || '';
                    const extraAdultRate = (barRates.extraAdultRate && barRates.extraAdultRate[0].extraAdultRate) || '';
                    const ratePlanName = rateData.ratePlanName.length > 0 ? rateData.ratePlanName[0].ratePlanName : '';
                   // Fetch all objects from the inclusionPlan array
                   const inclusionPlans = (inclusionArray.inclusionPlan && inclusionArray.inclusionPlan) || '';
                    //const inclusionPlans = rateData.inclusion[0].map(inclusionObj => inclusionObj.inclusionPlan).flat();
                    return {
                        ...rateData._doc,
                        propertyId: rateData.propertyId || "",
                        roomTypeId: roomTypeId || '',
                        roomTypeName: roomTypeName || '',
                        barRatePlanId: rateData.barRatePlanId || "",
                        ratePlanTotal,
                        inclusion:inclusionPlans || '',
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
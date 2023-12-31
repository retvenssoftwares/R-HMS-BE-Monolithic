import barRatePlanModel from '../../models/barRatePlan.js'
import { findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js';
const getBarRatePlans = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }

            const result = await validateHotelCode(userId, propertyId)
            if (!result.success) {
                return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
            }
            const findBarRatePlans = await barRatePlanModel.find({ propertyId,"displayStatus.0.displayStatus":"1" }, 'propertyId barRatePlanId rateType roomType mealPlan ratePlanName inclusion barRates mealCharge inclusionCharge roundUp extraAdultRate extraChildRate ratePlanTotal shortCode createdBy').sort({_id:-1}).lean();

            if (findBarRatePlans.length > 0) {
                const mappedBarRatePlans = findBarRatePlans.map((plan) => {
                    const inclusionCount = plan.inclusion[0].inclusionPlan.length || '';
                    return {
                        ...plan._doc,
                        propertyId: plan.propertyId || '',
                        barRatePlanId: plan.barRatePlanId || '',
                        createdBy: plan.createdBy || '',
                        rateType: plan.rateType || '',
                        roomTypeId: plan.roomType[0].roomTypeId || '',
                        mealPlanId: plan.mealPlan[0].mealPlanId || '',
                        ratePlanName: plan.ratePlanName[0].ratePlanName || '',
                        shortCode: plan.shortCode[0].shortCode || '',
                        inclusion: plan.inclusion[0].inclusionPlan || '',
                        barRates: plan.barRates.roomBaseRate[0].roomBaseRate || '',
                        mealCharge: plan.barRates.mealCharge[0].mealCharge || '',
                        inclusionCharge: plan.barRates.inclusionCharge[0].inclusionCharge || '',
                        roundUp: plan.barRates.roundUp[0].roundUp || '',
                        extraAdultRate: plan.barRates.extraAdultRate[0].extraAdultRate || '',
                        extraChildRate: plan.barRates.extraChildRate[0].extraChildRate || '',
                        ratePlanTotal: plan.barRates.ratePlanTotal[0].ratePlanTotal || '',
                        inclusionCount : inclusionCount
                    }
                })
                return res.status(200).json({ data: mappedBarRatePlans, statuscode: 200 })
            } else {
                return res.status(404).json({ message: "No bar rate plans found", statuscode: 404 })
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
}
export default getBarRatePlans; 
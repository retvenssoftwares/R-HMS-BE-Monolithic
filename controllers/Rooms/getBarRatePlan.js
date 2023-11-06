import barRatePlanModel from '../../models/barRatePlan.js'
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
const getBarRatePlans = async (req, res) => {
    try{
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
        const findBarRatePlans = await barRatePlanModel.find({ propertyId }, 'propertyId barRatePlanId rateType roomType mealPlan ratePlanName inclusion barRates mealCharge inclusionCharge roundUp extraAdultRate extraChildRate ratePlanTotal shortCode createdBy').lean();
        
        if (findBarRatePlans.length > 0) {
            const mappedBarRatePlans = findBarRatePlans.map((plan) => {
                return {
                    ...plan._doc,
                    propertyId: plan.propertyId || '',
                    barRatePlanId: plan.barRatePlanId || '',
                    createdBy: plan.createdBy || '',
                    rateType : plan.rateType || '',
                    roomType: plan.roomType[0].roomTypeId || '',
                    mealPlan: plan.mealPlan[0].mealPlan || '',
                    ratePlanName: plan.ratePlanName[0].ratePlanName || '',
                    shortCode: plan.shortCode[0].shortCode || '',
                    inclusion: plan.inclusion[0].inclusionPlan || '',
                    barRates: plan.barRates.roomBaseRate[0].roomBaseRate || '',
                    mealCharge: plan.barRates.mealCharge[0].mealCharge || '',
                    inclusionCharge: plan.barRates.inclusionCharge[0].inclusionCharge || '',
                    roundUp: plan.barRates.roundUp[0].roundUp || '',
                    extraAdultRate: plan.barRates.extraAdultRate[0].extraAdultRate || '',
                    extraChildRate: plan.barRates.extraChildRate[0].extraChildRate || '',
                    ratePlanTotal: plan.barRates.ratePlanTotal[0].ratePlanTotal || ''

                }
            })
            return res.status(200).json({ data: mappedBarRatePlans, statuscode: 200 })
        } else {
            return res.status(404).json({ message: "No bar rate plans found", statuscode: 404 })
        }
    }else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
    }catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
}
export default getBarRatePlans;
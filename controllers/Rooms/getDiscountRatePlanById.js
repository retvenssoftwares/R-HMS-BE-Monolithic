import discountPlanModel from "../../models/discountPlan.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const discountPlanGet = async (req, res) => {
    try {
        const { userId, discountPlanId } = req.query
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findPlan = await discountPlanModel.findOne({ discountPlanId }, 'blackOutDates applicableOn discountType discountName shortCode discountPercent discountPrice validityPeriodFrom validityPeriodTo propertyId discountPlanId -_id').lean();
        if (!findPlan) {
            return res.status(404).json({ message: "Rate Plan not found", statuscode: 404 })
        }
        // Fetch the 0th object for array fields
        const planData = {
            ...findPlan,
            mealPlanId: findPlan.mealPlan.length > 0 ? findPlan.mealPlan[0].mealPlanId : "",
            ratePlanName: findPlan.ratePlanName.length > 0 ? findPlan.ratePlanName[0].ratePlanName : "",
            shortCode: findPlan.shortCode.length > 0 ? findPlan.shortCode[0].shortCode : "",
            inclusion: findPlan.inclusion.length > 0 ? findPlan.inclusion[0].inclusionPlan[0] : "",
            barRates: {
                roomBaseRate: findPlan.barRates.roomBaseRate.length > 0 ? findPlan.barRates.roomBaseRate[0].roomBaseRate : "",
                mealCharge: findPlan.barRates.mealCharge.length > 0 ? findPlan.barRates.mealCharge[0].mealCharge : "",
                inclusionCharge: findPlan.barRates.inclusionCharge.length > 0 ? findPlan.barRates.inclusionCharge[0].inclusionCharge : "",
                roundUp: findPlan.barRates.roundUp.length > 0 ? findPlan.barRates.roundUp[0].roundUp : "",
                extraAdultRate: findPlan.barRates.extraAdultRate.length > 0 ? findPlan.barRates.extraAdultRate[0].extraAdultRate : "",
                extraChildRate: findPlan.barRates.extraChildRate.length > 0 ? findPlan.barRates.extraChildRate[0].extraChildRate : "",
                ratePlanTotal: findPlan.barRates.ratePlanTotal.length > 0 ? findPlan.barRates.ratePlanTotal[0].ratePlanTotal : "",
            },
        };

        return res.status(200).json({ data: planData, statuscode: 200 });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default discountPlanGet
import discountRatePlanModel from '../../models/discountPlan.js';
import { findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js';
const geAllDiscountPlans = async (req, res) => {
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
            const findDiscountRatePlans = await discountRatePlanModel.find({ propertyId, "displayStatus.0.displayStatus": "1" }, 'blackOutDates applicableOn discountType discountName newRatePlanName shortCode discountPercent discountPrice validityPeriodFrom validityPeriodTo propertyId discountPlanId barRates.extraAdultRate barRates.extraChildRate barRates.discountTotal -_id').sort({ _id: -1 }).lean();

            if (findDiscountRatePlans.length > 0) {
                const mappedDiscountRatePlans = findDiscountRatePlans.map((plan) => {
                    return {
                        propertyId: plan.propertyId || '',
                        discountPlanId: plan.discountPlanId || '',
                        rateType: plan.rateType || '',
                        createdBy: plan.createdBy || '',
                        createdOn: plan.createdOn || '',
                        roomTypeId: plan.roomTypeId || '',
                        ratePlanId: plan.ratePlanId || '',
                        discountName: plan.discountName[0].discountName || '',
                        shortCode: plan.shortCode[0].shortCode || '',
                        newRatePlanName: plan.newRatePlanName[0].newRatePlanName || '',
                        discountType: plan.discountType[0].discountType || '',
                        discountPersent: plan.discountPercent[0].discountPersent || '',
                        discountPrice: plan.discountPrice[0].discountPrice || '',
                        validityPeriodFrom: plan.validityPeriodFrom[0].validityPeriodFrom || '',
                        validityPeriodTo: plan.validityPeriodTo[0].validityPeriodTo || '',
                        blackOutDates: plan.blackOutDates.length > 0 ? plan.blackOutDates[0].blackOutDates : "",
                        extraAdultRate: plan.barRates.extraAdultRate[0].extraAdultRate || '',
                        extraChildRate: plan.barRates.extraChildRate[0].extraChildRate || '',
                        discountTotal: plan.barRates.discountTotal[0].discountTotal || '',
                    }
                })
                return res.status(200).json({ data: mappedDiscountRatePlans, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No discount rate plans found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
}

export default geAllDiscountPlans;


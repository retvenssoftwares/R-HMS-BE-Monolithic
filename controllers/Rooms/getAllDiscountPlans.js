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
            const findDiscountRatePlans = await discountRatePlanModel.find({ propertyId }, 'blackOutDates applicableOn discountType discountName shortCode discountPercent discountPrice validityPeriodFrom validityPeriodTo propertyId discountPlanId -_id').lean();

            if (findDiscountRatePlans.length > 0) {
                const mappedDiscountRatePlans = findDiscountRatePlans.map((plan) => {
                    return {
                        ...plan._doc,
                        blackOutDates: plan.blackOutDates.length > 0 ? plan.blackOutDates[0].blackOutDates : "",
                        applicableOn: plan.applicableOn.length > 0 ? plan.applicableOn[0].applicableOn : "",
                        shortCode: plan.shortCode.length > 0 ? plan.shortCode[0].shortCode : "",
                        validityPeriodFrom: plan.validityPeriodFrom.length > 0 ? plan.validityPeriodFrom[0].validityPeriodFrom : "",
                        validityPeriodTo: plan.validityPeriodTo.length > 0 ? plan.validityPeriodTo[0].validityPeriodTo : "",
                        discountType: plan.discountType.length > 0 ? plan.discountType[0].discountType : '',
                        discountName: plan.discountName.length > 0 ? plan.discountName[0].discountName : '',
                        discountPercent: plan.discountPercent.length > 0 ? plan.discountPercent[0].discountPercent : '',
                        discountPrice: plan.discountPrice.length > 0 ? plan.discountPrice[0].discountPrice : ''
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


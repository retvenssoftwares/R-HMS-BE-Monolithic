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
            blackOutDates: findPlan.blackOutDates.length > 0 ? findPlan.blackOutDates[0].blackOutDates : "",
            applicableOn: findPlan.applicableOn.length > 0 ? findPlan.applicableOn[0].applicableOn : "",
            shortCode: findPlan.shortCode.length > 0 ? findPlan.shortCode[0].shortCode : "",
            validityPeriodFrom: findPlan.validityPeriodFrom.length > 0 ? findPlan.validityPeriodFrom[0].validityPeriodFrom : "",
            validityPeriodTo: findPlan.validityPeriodTo.length > 0 ? findPlan.validityPeriodTo[0].validityPeriodTo : "",
            discountType: findPlan.discountType.length > 0 ? findPlan.discountType[0].discountType : '',
            discountName: findPlan.discountName.length > 0 ? findPlan.discountName[0].discountName : '',
            discountPercent: findPlan.discountPercent.length > 0 ? findPlan.discountPercent[0].discountPercent : '',
            discountPrice: findPlan.discountPrice.length > 0 ? findPlan.discountPrice[0].discountPrice : ''
        };

        return res.status(200).json({ data: planData, statuscode: 200 });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default discountPlanGet
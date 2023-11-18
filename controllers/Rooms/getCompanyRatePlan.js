import companyRatePlanModel from "../../models/companyRatePlane.js"
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken } from '../../helpers/helper.js';

const companyRatePlans = async (req, res) => {
    try{
    const {companyRatePlanId,userId} = req.query
    const findUser=await verifiedUser.findOne({userId:userId})
    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId,authCodeValue );
    if(!findUser){
        return res.status(404).json({ message: "Please enter valid userId", statuscode: 404 })
    }
    if(result.success){
    const findRatePlan = await companyRatePlanModel.findOne({companyRatePlanId :companyRatePlanId });
    if (!findRatePlan) {
        return res.status(404).json({ message: "Please enter valid companyRatePlanId", statuscode: 404 })
    }
    if (findRatePlan) {

        const companyRatePlan={
                
                rateType : findRatePlan.rateType || "",
                roomTypeId: findRatePlan.roomTypeId || '',
                mealPlanId : findRatePlan.mealPlanId || '',
                companyName : findRatePlan.companyName || '',
                ratePlanInclusion : findRatePlan.ratePlanInclusion[0].ratePlanInclusion || '',
                ratePlanName : findRatePlan.ratePlanName[0].ratePlanName || '',
                shortCode : findRatePlan.shortCode[0].shortCode || '',
                inclusionTotal : findRatePlan.inclusionTotal[0].inclusionTotal || '',
                roomBaseRate : findRatePlan.barRates.roomBaseRate[0].roomBaseRate || '',
                mealCharge : findRatePlan.barRates.mealCharge[0].mealCharge || '',
                inclusionCharge : findRatePlan.barRates.inclusionCharge[0].inclusionCharge || '',
                roundUp : findRatePlan.barRates.roundUp[0].roundUp || '',
                extraAdultRate : findRatePlan.barRates.extraAdultRate[0].extraAdultRate || '',
                extraChildRate : findRatePlan.barRates.extraChildRate[0].extraChildRate || '',
                ratePlanTotal : findRatePlan.barRates.ratePlanTotal[0].ratePlanTotal || '',
                
            }

        return res.status(200).json({ data: companyRatePlan, statuscode: 200 });
    } else {
        return res.status(200).json({ message: "No company Rate Plan Found", statuscode: 200 });
    }
    }
    }catch (error) {
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
}

}
export default companyRatePlans
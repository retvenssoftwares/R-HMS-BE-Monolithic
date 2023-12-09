import ratePlan from "../../models/barRatePlan.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js"
import mealPlan from "../../models/mealPlan.js";
const getBarRatePlanById = async (req, res) => {
    try {
        const { userId, barRatePlanId } = req.query
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const barRatePlanIds = await ratePlan.findOne({barRatePlanId})
        if (!barRatePlanIds) {
            return res.status(404).json({ message: "Enter valid bar Rate plan Id ", statuscode: 404 })
        }
        const findPlan = await ratePlan.findOne({ barRatePlanId,"displayStatus.0.displayStatus":"1" }, 'roomType mealPlan ratePlanName shortCode inclusion barRates propertyId barRatePlanId -_id').sort({_id:-1}).lean();
     
        // Fetch the 0th object for array fields
        if(findPlan) {
            let mealPlanName;
                const mealPlanId = findPlan.mealPlan[0].mealPlanId;
                  if (mealPlanId) {
                    const mealPlanData = await mealPlan.find({mealPlanId});
                    if(mealPlanData.length>0){
                    mealPlanName = mealPlanData.map(item => item.mealPlanName[0].mealPlanName);    
                }
            }
        const planData = {
            ...findPlan._doc,
            roomTypeId: findPlan.roomType.length > 0 ? findPlan.roomType[0].roomTypeId : "",
            mealPlanId: findPlan.mealPlan.length > 0 ? findPlan.mealPlan[0].mealPlanId : "",
            mealPlanName:  mealPlanName[0] || "",
            ratePlanName: findPlan.ratePlanName.length > 0 ? findPlan.ratePlanName[0].ratePlanName : "",
            shortCode: findPlan.shortCode.length > 0 ? findPlan.shortCode[0].shortCode : "",
            inclusion: findPlan.inclusion.length > 0 ? findPlan.inclusion[0].inclusionPlan : "",
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
        
        delete planData.roomType;
        delete planData.mealPlan;
        return res.status(200).json({ data: planData, statuscode: 200 });
    }else{
        return res.status(404).json({ message: "Rate plan not found ", statuscode: 404 }) 
    }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default getBarRatePlanById
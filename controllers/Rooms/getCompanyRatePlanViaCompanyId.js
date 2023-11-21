import companyRatePlanModel from "../../models/companyRatePlane.js"
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
import roomTypeModel from "../../models/roomType.js";
import mealPlan from "../../models/mealPlan.js";

const companyRatePlansViaCompanyId = async (req, res) => {
    try{
    const {companyId,userId} = req.query
    const findUser=await verifiedUser.findOne({userId:userId})
    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId,authCodeValue );
    if(!findUser){
        return res.status(404).json({ message: "Please enter valid userId", statuscode: 404 })
    }
    if(result.success){
    const findRatePlan = await companyRatePlanModel.findOne({companyId :companyId ,"displayStatus.0.displayStatus": "1"}).sort({_id:-1}).lean();
    if (!findRatePlan) {
        return res.status(404).json({ message: "Please enter valid companyId", statuscode: 404 })
    }
    if (findRatePlan) {
        const roomTypeId= findRatePlan.roomTypeId 
        const mealPlanId= findRatePlan.mealPlanId
        if(roomTypeId && mealPlanId){
        const foundRoomType = await roomTypeModel.find({roomTypeId:roomTypeId });
        const foundMealPlan = await mealPlan.find({mealPlanId:mealPlanId})
        const roomType = foundRoomType.map((foundRoom) => ({
            roomTypeName: foundRoom.roomTypeName[0].roomTypeName,
        }));
        const mealPlans= foundMealPlan.map((foundMeal) => ({
            mealPlanName: foundMeal.mealPlanName[0].mealPlanName
        }))

        const companyRatePlan={

            shortCode : findRatePlan.shortCode[0].shortCode || '',
            ratePlanName : findRatePlan.ratePlanName[0].ratePlanName || '',
            roomType:roomType[0].roomTypeName || '',
            mealPlan : mealPlans.mealPlanName || '',
            inclusion : findRatePlan.ratePlanInclusion[0].ratePlanInclusion.length || '',
            ratePlanTotal : findRatePlan.barRates.ratePlanTotal[0].ratePlanTotal || '',
                
            }
            return res.status(200).json({ data: companyRatePlan, statuscode: 200 });
        }
        
    } else {
        return res.status(200).json({ message: "No company Rate Plan Found", statuscode: 200 });
    }
    }
    }catch (error) {
        console.log(error)
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
}

}
export default companyRatePlansViaCompanyId
import companyRatePlanModel from "../../models/companyRatePlane.js";
import discountPlan from "../../models/discountPlan.js"
import barRatePlan from "../../models/barRatePlan.js"
import mealPlan from "../../models/mealPlan.js";
import roomTypeModel from "../../models/roomType.js";

const allRatePlans = async(req,res)=>{
    try{
     const {propertyId}=req.query;

     const companyRatePlan=await companyRatePlanModel.find({propertyId}).lean();
     console.log("company",companyRatePlan)
     const roomTypeId=companyRatePlan[0].roomTypeId
     console.log("RoomType",roomTypeId)
     const roomTypeName= await roomTypeModel.find({roomTypeId},'roomTypeName -_id')
     console.log("RoomTypeName",roomTypeName)

     if(!companyRatePlan){
        return res.status(404).json({message: "enter valid propertyId",statuscode:404})
    }
    //  const discountPlans = await discountPlan.find({propertyId},'shortCode discountName roomTypeId rateTypeId ratePlanTotal extraAdultRate extraChildRate ratePlanInclusion').lean();

     const mealPlans = await mealPlan.find({propertyId},'shortCode mealPlanName mealPlanId ').lean();
     
     const barratePlans = await barRatePlan.find({propertyId},'shortCode ratePlanName roomTypeId rateType mealPlanId ratePlanTotal extraAdultRate extraChildRate inclusion').lean();

     if(companyRatePlan){
     const ratePlan = companyRatePlan.map((rate)=>{
        return{
            ...rate._doc,
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomtypeName:roomTypeName[0].roomTypeName[0].roomTypeName  || '',
            inclusion:rate.ratePlanInclusion.length || '',
            extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
        }
     })
     return res.status(200).json({data:ratePlan,statuscode:200})
    }
}catch(err){
    console.error(err)
    return res.status(500).json({message: "internal server error",statuscode:500})
}
}
export default allRatePlans
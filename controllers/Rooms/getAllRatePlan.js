import companyRatePlanModel from "../../models/companyRatePlane.js";
import discountPlan from "../../models/discountPlan.js"
import barRatePlan from "../../models/barRatePlan.js"
import mealPlan from "../../models/mealPlan.js";
import roomTypeModel from "../../models/roomType.js";

const allRatePlans = async(req,res)=>{
    try{
     const {propertyId}=req.query;

     const companyRatePlan=await companyRatePlanModel.find({propertyId}).lean();
     const barRatePlanData=await barRatePlan.find({propertyId}).lean();
 
     //CompanyRatePlan
    //Map roomTypeId from companyRatePlan
    const roomTypeIds = companyRatePlan.map((item) => item.roomTypeId);
    const roomTypeData = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });

    const CompanyratePlan = companyRatePlan.map((rate) => {
        const matchingRoomTypes = roomTypeData.filter((room) => room.roomTypeId === rate.roomTypeId).map((foundRoomType) => ({
                roomTypeName: foundRoomType.roomTypeName[0]?.roomTypeName || '',
            }))
    
     
        return{
            rateType:rate.rateType || '',
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomTypeName: matchingRoomTypes.length > 0 ? matchingRoomTypes : [], 
            inclusion:rate.ratePlanInclusion.length || '',
            extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
        }
    });



    //BarRatePlan
    //Map roomTypeId from barRatePlan
    const barroomTypeIds = barRatePlanData.map((item) => item.roomType.roomTypeId);
    const roomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: barroomTypeIds } });

    const barRatePlanResponse = barRatePlanData.map((rate) => {
        const matchingRoomTypes = roomTypeDatas.filter((room) => room.roomTypeId === rate.roomTypeId).map((foundRoomType) => ({
            roomTypeName: foundRoomType.roomTypeName[0]?.roomTypeName || '',
        }))

        return {
            rateType: rate.rateType || '',
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomTypeName: matchingRoomTypes.length > 0 ? matchingRoomTypes : [],
            inclusion: rate.inclusion.length || '',
            extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
        };
    });
     
     return res.status(200).json({companyRatePlan:CompanyratePlan,barRatePlan:barRatePlanResponse,statuscode:200})
    
}catch(err){
    console.error(err)
    return res.status(500).json({message: "internal server error",statuscode:500})
}
}
export default allRatePlans
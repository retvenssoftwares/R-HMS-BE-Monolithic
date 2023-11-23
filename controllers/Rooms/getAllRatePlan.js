import companyRatePlanModel from "../../models/companyRatePlane.js";
import barRatePlan from "../../models/barRatePlan.js"
import packageModel from '../../models/package.js'
import discountPlan from "../../models/discountPlan.js"
import roomTypeModel from "../../models/roomType.js";

const allRatePlans = async(req,res)=>{
    try{
     const {propertyId}=req.query;

     const companyRatePlan=await companyRatePlanModel.find({propertyId}).lean();
    
 
     //CompanyRatePlan
    //Map roomTypeId from companyRatePlan
    const roomTypeIds = companyRatePlan.map((item) => item.roomTypeId);
    const roomTypeData = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });

    const CompanyratePlan = companyRatePlan.map((rate) => {
        const matchingRoomTypes = roomTypeData.find((room) => room.roomTypeId === rate.roomTypeId
        );
    
        const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
        return{
            rateType:rate.rateType || '',
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomTypeName: roomTypeName,
            inclusion:rate.ratePlanInclusion.length || '',
            extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
        }
    });



    //BarRatePlan
    //Map roomTypeId from barRatePlan
    const barRatePlanData=await barRatePlan.find({propertyId}).lean();
    const barroomTypeIds = barRatePlanData.map((item) => item.roomType[0].roomTypeId);
    const roomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: barroomTypeIds } });

    const barRatePlanResponse = barRatePlanData.map((rate) => {
        const matchingRoomTypes = roomTypeDatas.find((room) => room.roomTypeId === rate.roomType?.roomTypeId
        );
        const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
        console.log(roomTypeName)
        return {
            rateType: rate.rateType || '',
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomTypeName: roomTypeName,
            inclusion: rate.inclusion.length || '',
            extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
        };
    });


    //PackageRatePlan
    //Map roomTypeId from packageRatePlan
    const PackageRatePlanData=await packageModel.find({propertyId}).lean();
    const packageroomTypeIds = PackageRatePlanData.map((item) => item.roomTypeId);
    const packageRoomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: packageroomTypeIds } });

    const packageRatePlanResponse = PackageRatePlanData.map((rate) => {
        const matchingRoomTypes = packageRoomTypeDatas.find((room) => room.roomTypeId === rate.roomTypeId
        );
        const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
       // console.log(roomTypeName)
        return {
            rateType: rate.rateType || '',
            shortCode: rate.shortCode[0].shortCode || '',
            ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            roomTypeName: roomTypeName,
            inclusion: rate.ratePlanInclusion.length || '',
            ratePlanTotal:rate.barRates.packageTotal[0].packageTotal || '',
            extraAdultRate:rate.barRates.extraAdultRate[0].extraAdultRate || '',
            extraChildRate:rate.barRates.extraChildRate[0].extraChildRate || '',
        };
    });

    //discountPlan
    //Map roomTypeId from discountPlan
//     const discountRatePlanData=await discountPlan.find({propertyId}).lean();
//     //console.log(discountRatePlanData)
 
//   // Extract roomTypeIds from the nested structure within applicableOn
// const roomTypeIdsInApplicableOn = discountRatePlanData.flatMap((item) => item.applicableOn[0].applicableOn.map((applicable) => applicable.roomTypeId));
// //console.log(roomTypeIdsInApplicableOn)
// // Fetch room type data based on the extracted roomTypeIds
// const discountRoomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIdsInApplicableOn } });
// //console.log(discountRoomTypeDatas)
// const rateType ="discount"
//     const discountRatePlanResponse = discountRatePlanData.map((rate) => {
//         const matchingRoomTypes = discountRoomTypeDatas.find((room) => room.roomTypeId === rate.roomTypeId
//         );
//         const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
//         console.log(roomTypeName)
//         return {
//             rateType: rateType || '',
//             shortCode: rate.shortCode[0].shortCode || '',
//             ratePlanName:rate.discountName[0].discountName || '',
//             applicableOn:rate.applicableOn[0].applicableOn || '',
//         };
//     });


     
  return res.status(200).json({companyRatePlan:CompanyratePlan,barRatePlan:barRatePlanResponse,packageRatePlan:packageRatePlanResponse,statuscode:200})
    
}catch(err){
    console.error(err)
    return res.status(500).json({message: "internal server error",statuscode:500})
}
}
export default allRatePlans
import ratePlan from "../../models/ratePlan.js"

const ratePlanFunction = async(req,res)=>{
    const data = new ratePlan({
        ratePlanName:req.body.ratePlanName,
        shortCode:req.body.shortCode,
        roomType:req.body.roomType,
        rateTypeId:req.body.rateTypeId,
        roomBaseRate:req.body.roomBaseRate,
        perAdults:req.body.perAdults,
        perChild:req.body.perChild,
        ratePlanTotal:req.body.ratePlanTotal
    })

    await data.save()
}

export default ratePlanFunction
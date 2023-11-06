import companyRatePlanModel from '../../models/companyRatePlane.js'

const getCompanyRatePlans = async (req, res) => {
    const { propertyId } = req.query
    const findCompanyRatePlans = await companyRatePlanModel.find({ propertyId }, 'propertyId companyRatePlanId roomTypeId mealPlan companyName inclusionTotal ratePlanInclusion ratePlanName shortCode').lean();

    if (findCompanyRatePlans.length > 0) {
        const mappedCompanyRatePlans = findCompanyRatePlans.map((plan) => {
            return {
                ...plan._doc,
                propertyId: plan.propertyId || '',
                companyRatePlanId: plan.companyRatePlanId || '',
                roomTypeId: plan.roomTypeId || '',
                mealPlan: plan.mealPlan[0].mealPlanId || '',
                ratePlanInclusion: plan.ratePlanInclusion[0].ratePlanInclusion || '',
                ratePlanName: plan.ratePlanName[0].ratePlanName || '',
                shortCode: plan.shortCode[0].shortCode || '',
                inclusionTotal: plan.inclusionTotal[0].inclusionTotal || ''
            }
        })
        return res.status(200).json({ data: mappedCompanyRatePlans, statuscode: 200 })
    } else {
        return res.status(404).json({ message: "No company rate plans found", statuscode: 404 })
    }

}

export default getCompanyRatePlans;
import companyRatePlanModel from '../../models/companyRatePlane.js'
import { findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js';
import mealPlan from '../../models/mealPlan.js';
const getCompanyRatePlans = async (req, res) => {
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
            const findCompanyRatePlans = await companyRatePlanModel.find({ propertyId,"displayStatus.0.displayStatus":"1" }, 'propertyId companyRatePlanId roomTypeId mealPlanId companyId inclusionTotal ratePlanInclusion ratePlanName shortCode').sort({_id:-1}).lean();

            if (findCompanyRatePlans.length > 0) {
               
                const mappedCompanyRatePlans = await Promise.all(
                    findCompanyRatePlans.map(async (plan) => {
                      let mealPlanName = '';
                  
                      const mealPlanId = plan.mealPlanId;
                      if (mealPlanId) {
                        const mealPlanNames = await mealPlan.find({ mealPlanId });
                  
                        if (mealPlanNames.length > 0) {
                          mealPlanName = mealPlanNames[0].mealPlanName[0].mealPlanName;
                        }
                      }
                  
                      return {
                        ...plan._doc,
                        propertyId: plan.propertyId || '',
                        companyRatePlanId: plan.companyRatePlanId || '',
                        roomTypeId: plan.roomTypeId || '',
                        mealPlanId: plan.mealPlanId || '',
                        mealPlanName: mealPlanName || '',
                        companyId: plan.companyId || '',
                        ratePlanInclusion: plan.ratePlanInclusion[0]?.ratePlanInclusion || '', 
                        ratePlanName: plan.ratePlanName[0]?.ratePlanName || '', 
                        shortCode: plan.shortCode[0]?.shortCode || '', 
                        inclusionTotal: plan.inclusionTotal[0]?.inclusionTotal || '', 
                      };
                    })
                  );
                                    
                return res.status(200).json({ data: mappedCompanyRatePlans, statuscode: 200 })
            } else {
                return res.status(404).json({ message: "No company rate plans found", statuscode: 404 })
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
}

export default getCompanyRatePlans;
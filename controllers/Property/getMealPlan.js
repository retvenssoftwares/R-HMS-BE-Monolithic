import mealPlan from '../../models/mealPlan.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';

const getMealPlan = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllMealPlan = await mealPlan.find({ propertyId });

            if (findAllMealPlan.length > 0) {
                const convertedMealPlan = findAllMealPlan.map(meal => {
                    const convertedDateUTC = convertTimestampToCustomFormat(meal.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (meal.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(meal.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = meal.modifiedBy.length > 0 ? meal.modifiedBy[0].modifiedBy : "";

                    return {
                        ...meal._doc,
                        createdOn: convertedDateUTC,
                        shortCode: meal.shortCode[0].shortCode || '',
                        mealPlanName: meal.mealPlanName[0].mealPlanName || '',
                        chargesPerOccupancy: meal.chargesPerOccupancy[0].chargesPerOccupancy || '',
                        modifiedBy: modifiedBy,
                        mealPlanId: meal.mealPlanId || '',
                        modifiedOn: convertedModifiedOn,
                    };
                });

                return res.status(200).json({ data: convertedMealPlan, statuscode: 200 });
            } else {
                return res.status(404).json({ message: "No meal found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getMealPlan;

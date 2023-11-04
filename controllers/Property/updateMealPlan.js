import randomstring from 'randomstring'
import mealPlan from '../../models/mealPlan.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchMealPlan = async (req, res) => {
    try {
        const { shortCode ,mealPlanName,chargesPerOccupancy } = req.body;
        const { mealPlanId, userId } = req.query;
        const findUser = await verifiedUser.findOne({ userId: userId});

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        console.log(result);
        if (result.success) {
            let userRole = findUser.role[0].role;


            const findMealPlan= await mealPlan.findOne({ mealPlanId });

            if (!findMealPlan || !mealPlanId) {
                return res.status(404).json({ message: "meal plan not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomstring.generate(10)
                };
                findMealPlan.shortCode.unshift(shortCodeObject);
            }

            if (mealPlanName) {
                const mealPLanNameObject = {
                    mealPlanName: mealPlanName,
                    logId: randomstring.generate(10)
                };
                findMealPlan.mealPlanName.unshift(mealPLanNameObject);
            }

            if (chargesPerOccupancy) {
                const chargesPerOccupancyObject = {
                    chargesPerOccupancy: chargesPerOccupancy,
                    logId: randomstring.generate(10)
                };
                findMealPlan.chargesPerOccupancy.unshift(chargesPerOccupancyObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomstring.generate(10)
            };

            findMealPlan.modifiedBy.unshift(modifiedByObject);
            var currentUTCTime = await getCurrentUTCTimestamp()
            findMealPlan.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomstring.generate(10) });

            const updatedMealPlan = await findMealPlan.save();

            if (updatedMealPlan) {
                return res.status(200).json({ message: "Meal Plan successfully updated", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
       
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchMealPlan;

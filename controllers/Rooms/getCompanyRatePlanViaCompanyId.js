import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import mealModel from "../../models/mealPlan.js"
import compnayModel from "../../models/companyRatePlane.js"
//import barRatePlan from "../../models/barRatePlan.js"
import amenitiesModel from '../../models/amenity.js'
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";
import { log } from "console";

const fetchRoom = async (req, res) => {
    try {
        const { targetTimeZone, userId, companyId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {

           // const roomImages = await roomImage.find({ roomTypeId: roomTypeId });
            // const barrate = await barRatePlan.find({ 'roomType.roomTypeId': roomTypeId });
            //console.log(barrate)

            const companyRatePlan = await compnayModel.find({ companyId: companyId });
            if (!companyRatePlan) {
                return res.status(400).json({ message: "Please enter companyId", statuscode: 400 })
            }


            if (companyRatePlan.length > 0) {
                // Map and modify each room object to only include the first element of the arrays
                const convertedProperties = await Promise.all(companyRatePlan.map(async (room) => {
                    // Convert the dateUTC to the user's time zone
                  //  const convertedDateUTC = convertTimestampToCustomFormat(room.createdOn, targetTimeZone);

                    // Access the first element of each array
                    const ratePlanName =room.ratePlanName[0].ratePlanName || '';
                    const roomTypeId = room.roomTypeId || '';
                     const mealPlanId = room.mealPlanId || '';
                     const shortCode =room.shortCode[0].shortCode || '';
                     const inclusion =room.ratePlanInclusion.length || '';
                     const ratePlanTotal=room.barRates.ratePlanTotal[0].ratePlanTotal || '';


                       // Fetch roomTypeName based on roomTypeId
                const roomType = await roomModel.findOne({ roomTypeId: roomTypeId });
                const roomTypeName = roomType ? roomType.roomTypeName : '';

                

                       // Fetch mealPlanName based on mealPlanId
                       const mealPlan = await mealModel.findOne({ mealPlanId: mealPlanId });
                       const mealPlanName = mealPlan ? mealPlan.mealPlanName : '';


                    return {
                        shortCode: shortCode,
                        ratePlanName:ratePlanName,
                        roomTypeName:roomTypeName[0].roomTypeName || '',
                        mealPlanName:mealPlanName[0].mealPlanName || '',
                        inclusion:inclusion,
                        ratePlanTotal:ratePlanTotal
                        
                    };


                }));

                return res.status(200).json({ data: convertedProperties, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No room found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default fetchRoom;



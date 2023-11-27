import barRatePlan from "../../models/barRatePlan.js";
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import checkRate from "../InventoryAndRates/checkAvailableRates.js";

const getRatePlansList = async (req, res) => {
    try {
        const { roomTypeId, checkInDate, checkOutDate, userId } = req.query;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRatePlans = await barRatePlan.find({ "roomType.roomTypeId": roomTypeId,"displayStatus.0.displayStatus":"1"})
            .select("ratePlanName propertyId barRatePlanId roomType barRates").sort({_id:-1}).lean(); 

        if (findRatePlans.length === 0) {
            return res.status(200).json({ message: "No rateplans found", status: 200 });
        }

        const foundRateData = await Promise.all(findRatePlans.map(async (rateData) =>               {
            const roomTypeName = await roomTypeModel.findOne({ roomTypeId: roomTypeId }).select('roomTypeName').sort({_id:-1}).lean();

            let baseRate = 0;
            let extraAdultRates = 0;
            let extraChildRates = 0;
            let roomRate = {};

            const checkRateResponse = await checkRate({
                query: {
                    userId,
                    roomTypeId: roomTypeId,
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    status: true
                },
                headers: {
                    authcode: authCodeValue,
                },
            }, res);

            checkRateResponse.forEach((item) => {
                item.baseRates.forEach((item2) => {
                    const price = parseInt(item2.baseRate);
                    const adultPrices = parseInt(item2.extraAdultRate);
                    const childRate = parseInt(item2.extraChildRate);

                    baseRate += price;
                    extraAdultRates += adultPrices;
                    extraChildRates += childRate;

                    roomRate[item.barRatePlanId] = [baseRate, extraAdultRates, extraChildRates];
                   
                });
                baseRate = 0;
                extraAdultRates = 0;
                extraChildRates = 0;

            });

            // console.log(roomRate)

            const roomRateData = roomRate[rateData.barRatePlanId];
            if (roomRateData) {
                const valuesAt0Position = roomRateData[0];
                const valuesAt1Position = roomRateData[1];
                const valuesAt2Position = roomRateData[2];

                const barRates = rateData.barRates || {};
                // const ratePlanTotal = (barRates.ratePlanTotal && barRates.ratePlanTotal[0].ratePlanTotal) || '';
                // const extraChildRate = (barRates.extraChildRate && barRates.extraChildRate[0].extraChildRate) || '';
                // const extraAdultRate = (barRates.extraAdultRate && barRates.extraAdultRate[0].extraAdultRate) || '';
                const ratePlanName = rateData.ratePlanName.length > 0 ? rateData.ratePlanName[0].ratePlanName : '';

                return {
                    ...rateData._doc,
                    propertyId: rateData.propertyId || "",
                    roomTypeId: roomTypeId || '',
                    roomTypeName: roomTypeName.roomTypeName[0].roomTypeName || '',
                    barRatePlanId: rateData.barRatePlanId || "",
                    ratePlanTotal: valuesAt0Position,
                    extraChildRate: valuesAt2Position,
                    extraAdultRate: valuesAt1Position,
                    ratePlanName
                };
            } else {
                return res.status(404).json({ message: "data not found", statuscode: 404 });;
            }
        }));

        return res.status(200).json({ data: foundRateData, statuscode: 200 });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};

export default getRatePlansList;

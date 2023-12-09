import barRatePlan from "../../models/barRatePlan.js";
import moment from "moment";
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

        const findRatePlans = await barRatePlan.find({ "roomType.roomTypeId": roomTypeId, "displayStatus.0.displayStatus": "1" })
            .select("ratePlanName propertyId barRatePlanId roomType barRates").sort({ _id: -1 }).lean();

        // console.log(findRatePlans)

        if (findRatePlans.length === 0) {
            return res.status(200).json({ message: "No rateplans found", status: 200 });
        }

        const adjustedCheckOutDate = moment(checkOutDate).subtract(1, 'days').format('YYYY-MM-DD');

        // Perform the roomTypeModel.findOne call outside the loop
        const roomTypeData = await roomTypeModel.findOne({ roomTypeId: roomTypeId }).select('roomTypeName').sort({ _id: -1 }).lean();

        // Perform the checkRate API call outside the loop
        const checkRateResponse = await checkRate({
            query: {
                userId,
                roomTypeId: roomTypeId,
                startDate: checkInDate,
                endDate: adjustedCheckOutDate,
                status: true
            },
            headers: {
                authcode: authCodeValue,
            },
        }, res);


        checkRateResponse.map((item)=>{
            console.log(item.barRatePlanId,item.baseRates)
        })

        const foundRateData = await Promise.all(findRatePlans.map(async (rateData) => {
            // Now use the roomTypeData and checkRateResponse for each rateData

            let baseRate = 0;
            let extraAdultRates = 0;
            let extraChildRates = 0;
            let roomRate = {};

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

            const roomRateData = roomRate[rateData.barRatePlanId];

            if (roomRateData) {
                const valuesAt0Position = roomRateData[0];
                const valuesAt1Position = roomRateData[1];
                const valuesAt2Position = roomRateData[2];

                const barRates = rateData.barRates || {};
                const ratePlanName = rateData.ratePlanName.length > 0 ? rateData.ratePlanName[0].ratePlanName : '';

                return {
                    ...rateData._doc,
                    propertyId: rateData.propertyId || "",
                    roomTypeId: roomTypeId || '',
                    roomTypeName: roomTypeData.roomTypeName[0].roomTypeName || '',
                    barRatePlanId: rateData.barRatePlanId || "",
                    ratePlanTotal: valuesAt0Position,
                    extraChildRate: valuesAt2Position,
                    extraAdultRate: valuesAt1Position,
                    ratePlanName
                };
            } else {
                return res.status(404).json({ message: "data not found", statuscode: 404 });
            }
        }));


        return res.status(200).json({ data: foundRateData, statuscode: 200 });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};

export default getRatePlansList;

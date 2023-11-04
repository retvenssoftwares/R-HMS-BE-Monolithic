import ratesAndRestrictions from '../../models/manageRatesAndRestrictions.js'
import axios from 'axios'; // Import Axios
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const manageRates = async (req, res, io) => {
    try {
        const {
            userId,
            propertyId,
            roomTypeId,
            startDate,
            ratePlanId,
            endDate,
            isBaseRate,
            isExtraAdultRate,
            isExtraChildRate,
            baseRate,
            extraAdultRate,
            extraChildRate,
            source,
            days
        } = req.body

        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            // Get today's date as a string in "yyyy-mm-dd" format
            const today = new Date().toISOString().split('T')[0];

            // Parse startDate as a Date object
            const startDateObj = new Date(startDate).toISOString().split('T')[0];

            // Check if startDate is older than today's date
            if (startDateObj < today) {
                return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
            }

            // Find the rate document for the specified roomTypeId
            let findRates = await ratesAndRestrictions.findOne({ roomTypeId: roomTypeId, propertyId: propertyId, ratePlanId: ratePlanId });

            // Create the inventory record if it doesn't exist
            if (!findRates) {
                findRates = new ratesAndRestrictions({
                    roomTypeId: roomTypeId,
                    propertyId: propertyId,
                    ratePlanId: ratePlanId,
                    source: source,
                    manageRates: {
                        baseRate: [],
                        extraChildRate: [],
                        extraAdultRate: []
                    }
                });
            }

            // Calculate the number of days in the date range
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));//difference in the dates interval

            if (dayDifference < 0) {
                return res.status(400).json({ message: "End date cannot be before the start date", statuscode: 400 });
            }

            for (let i = 0; i <= dayDifference; i++) {
                const date = new Date(start);
                date.setDate(date.getDate() + i);

                const dateString = date.toISOString().split('T')[0];

                // Check if the day of the week is in the excluded list
                if (days) {
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                    if (!days.includes(dayOfWeek)) {
                        continue; // Skip updating rates and restrictions for excluded days
                    }
                }

                // console.log(dateString)

                if (isBaseRate) {
                    // Update the addedInventory array
                    const existingEntry = findRates.manageRates.baseRate.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.baseRate = baseRate;
                    } else {
                        // If the date does not exist, add a new entry to addedInventory
                        findRates.manageRates.baseRate.push({ date: dateString, baseRate: baseRate });
                    }
                }

                if (isExtraAdultRate) {
                    const existingEntry = findRates.manageRates.extraAdultRate.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        // If the date exists, update the blockedInventory
                        existingEntry.extraAdultRate = extraAdultRate;
                    } else {
                        // If the date does not exist, add a new entry to blockedInventory
                        findRates.manageRates.extraAdultRate.push({ date: dateString, extraAdultRate: extraAdultRate });
                    }
                }

                if (isExtraChildRate) {
                    const existingEntry = findRates.manageRates.extraChildRate.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        // If the date exists, update the blockedInventory
                        existingEntry.extraChildRate = extraChildRate;
                    } else {
                        // If the date does not exist, add a new entry to blockedInventory
                        findRates.manageRates.extraChildRate.push({ date: dateString, extraChildRate: extraChildRate });
                    }
                }


            }

            // Save the updated inventory document
            await findRates.save();

            // After inventory updates are done, call the getInventory API using Axios
            const getRatesResponse = await axios.get(`https://api.hotelratna.com/api/getInventory?userId=${userId}&propertyId=${propertyId}&checkInDate=${startDate}&checkOutDate=${endDate}`, {
                headers: {
                    'authcode': authCodeValue
                }
            });
            // Emit the response to connected clients via Socket.io
            // const socket = io("https://api.hotelratna.com"); // Replace YOUR_PORT wit
            io.emit("ratesUpdated", getRatesResponse.data);
            return res.status(200).json({ message: "Rates updated successfully", statuscode: 200 });

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }

}

export default manageRates
import restrictions from '../../models/manageRestrictions.js'
import { findUserByUserIdAndToken } from "../../helpers/helper.js"
const manageRestrictions = async (req, res) => {
    try {
        const {
            userId,
            propertyId,
            roomTypeId,
            startDate,
            ratePlanId,
            endDate,
            source,
            stopSell,
            isStopSell,
            isCOA,
            COA,
            isCOD,
            COD,
            isMinimumLOS,
            minimumLOS,
            isMaximumLOS,
            maximumLOS,
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
            let findRestrictions = await restrictions.findOne({ roomTypeId: roomTypeId, propertyId: propertyId, ratePlanId: ratePlanId });

            // Create the inventory record if it doesn't exist
            if (!findRestrictions) {
                findRestrictions = new restrictions({
                    roomTypeId: roomTypeId,
                    propertyId: propertyId,
                    ratePlanId: ratePlanId,
                    source: source,
                    manageRestrictions: {
                        stopSell: [],
                        COA: [],
                        COD: [],
                        minimumLOS: [],
                        maximumLOS: []
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

                if (isStopSell) {
                    const existingEntry = findRestrictions.manageRestrictions.stopSell.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.stopSell = stopSell;
                    } else {
                        findRestrictions.manageRestrictions.stopSell.push({ date: dateString, stopSell: stopSell });
                    }
                }

                if (isCOA) {
                    const existingEntry = findRestrictions.manageRestrictions.COA.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.COA = COA;
                    } else {
                        findRestrictions.manageRestrictions.COA.push({ date: dateString, COA: COA });
                    }
                }

                if (isCOD) {
                    const existingEntry = findRestrictions.manageRestrictions.COD.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.COD = COD;
                    } else {
                        findRestrictions.manageRestrictions.COD.push({ date: dateString, COD: COD });
                    }
                }

                if (isMaximumLOS) {
                    const existingEntry = findRestrictions.manageRestrictions.maximumLOS.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.maximumLOS = maximumLOS;
                    } else {
                        findRestrictions.manageRestrictions.maximumLOS.push({ date: dateString, maximumLOS: maximumLOS });
                    }
                }

                if (isMinimumLOS) {
                    const existingEntry = findRestrictions.manageRestrictions.minimumLOS.find(entry => entry.date === dateString);

                    if (existingEntry) {
                        existingEntry.minimumLOS = minimumLOS;
                    } else {
                        findRestrictions.manageRestrictions.minimumLOS.push({ date: dateString, minimumLOS: minimumLOS });
                    }
                }
            }

            // Save the updated inventory document
            await findRestrictions.save();

            return res.status(200).json({ message: "Restrictions updated successfully", statuscode: 200 });

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }

}

export default manageRestrictions
import ratesAndRestrictions from '../../models/manageRatesAndRestrictions.js'

const manageRatesRestrictions = async (req, res) => {
    try {
        const {
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
        // Get today's date as a string in "yyyy-mm-dd" format
        const today = new Date().toISOString().split('T')[0];

        // Parse startDate as a Date object
        const startDateObj = new Date(startDate).toISOString().split('T')[0];

        // Check if startDate is older than today's date
        if (startDateObj < today) {
            return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
        }

        // Find the rate document for the specified roomTypeId
        let findRatesAndRestrictions = await ratesAndRestrictions.findOne({ roomTypeId: roomTypeId, propertyId: propertyId, ratePlanId: ratePlanId });

        // Create the inventory record if it doesn't exist
        if (!findRatesAndRestrictions) {
            findRatesAndRestrictions = new ratesAndRestrictions({
                roomTypeId: roomTypeId,
                propertyId: propertyId,
                ratePlanId: ratePlanId,
                source: source,
                manageRates: {
                    baseRate: [],
                    extraChildRate: [],
                    extraAdultRate: []
                },
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

            if (isBaseRate) {
                // Update the addedInventory array
                const existingEntry = findRatesAndRestrictions.manageRates.baseRate.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.baseRate = baseRate;
                } else {
                    // If the date does not exist, add a new entry to addedInventory
                    findRatesAndRestrictions.manageRates.baseRate.push({ date: dateString, baseRate: baseRate });
                }
            }

            if (isExtraAdultRate) {
                const existingEntry = findRatesAndRestrictions.manageRates.extraAdultRate.find(entry => entry.date === dateString);

                if (existingEntry) {
                    // If the date exists, update the blockedInventory
                    existingEntry.extraAdultRate = extraAdultRate;
                } else {
                    // If the date does not exist, add a new entry to blockedInventory
                    findRatesAndRestrictions.manageRates.extraAdultRate.push({ date: dateString, extraAdultRate: extraAdultRate });
                }
            }

            if (isExtraChildRate) {
                const existingEntry = findRatesAndRestrictions.manageRates.extraChildRate.find(entry => entry.date === dateString);

                if (existingEntry) {
                    // If the date exists, update the blockedInventory
                    existingEntry.extraChildRate = extraChildRate;
                } else {
                    // If the date does not exist, add a new entry to blockedInventory
                    findRatesAndRestrictions.manageRates.extraChildRate.push({ date: dateString, extraChildRate: extraChildRate });
                }
            }

            if (isStopSell) {
                const existingEntry = findRatesAndRestrictions.manageRestrictions.stopSell.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.stopSell = stopSell;
                } else {
                    findRatesAndRestrictions.manageRestrictions.stopSell.push({ date: dateString, stopSell: stopSell });
                }
            }

            if (isCOA) {
                const existingEntry = findRatesAndRestrictions.manageRestrictions.COA.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.COA = COA;
                } else {
                    findRatesAndRestrictions.manageRestrictions.COA.push({ date: dateString, COA: COA });
                }
            }

            if (isCOD) {
                const existingEntry = findRatesAndRestrictions.manageRestrictions.COD.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.COD = COD;
                } else {
                    findRatesAndRestrictions.manageRestrictions.COD.push({ date: dateString, COD: COD });
                }
            }

            if (isMaximumLOS) {
                const existingEntry = findRatesAndRestrictions.manageRestrictions.maximumLOS.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.maximumLOS = maximumLOS;
                } else {
                    findRatesAndRestrictions.manageRestrictions.maximumLOS.push({ date: dateString, maximumLOS: maximumLOS });
                }
            }

            if (isMinimumLOS) {
                const existingEntry = findRatesAndRestrictions.manageRestrictions.minimumLOS.find(entry => entry.date === dateString);

                if (existingEntry) {
                    existingEntry.minimumLOS = minimumLOS;
                } else {
                    findRatesAndRestrictions.manageRestrictions.minimumLOS.push({ date: dateString, minimumLOS: minimumLOS });
                }
            }
        }

        // Save the updated inventory document
        await findRatesAndRestrictions.save();

        return res.status(200).json({ message: "Rates and restrictions updated successfully", statuscode: 200 });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }

}

export default manageRatesRestrictions
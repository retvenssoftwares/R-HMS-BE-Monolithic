import ratesAndRestrictions from '../../models/manageRatesAndRestrictions.js'

const manageRatesRestrictions = async (req, res) => {
    try {
        const { propertyId, roomTypeId, startDate, rateTypeId, endDate, isBaseRate, isExtraAdultRate, isExtraChildRate, baseRate, extraAdultRate, extraChildRate, source } = req.body
        // Get today's date as a string in "yyyy-mm-dd" format
        const today = new Date().toISOString().split('T')[0];

        // Parse startDate as a Date object
        const startDateObj = new Date(startDate).toISOString().split('T')[0];

        // Check if startDate is older than today's date
        if (startDateObj < today) {
            return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
        }

        // Find the rate document for the specified roomTypeId
        let findRatesAndRestrictions = await ratesAndRestrictions.findOne({ roomTypeId: roomTypeId, propertyId: propertyId, rateTypeId: rateTypeId });

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
                    findRatesAndRestrictions.manageInventory.blockedInventory.push({ date: dateString, extraAdultRate: extraAdultRate });
                }
            }

            if (isExtraChildRate) {
                const existingEntry = findRatesAndRestrictions.manageRates.extraChildRate.find(entry => entry.date === dateString);

                if (existingEntry) {
                    // If the date exists, update the blockedInventory
                    existingEntry.extraChildRate = extraChildRate;
                } else {
                    // If the date does not exist, add a new entry to blockedInventory
                    findRatesAndRestrictions.manageInventory.blockedInventory.push({ date: dateString, extraChildRate: extraChildRate });
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
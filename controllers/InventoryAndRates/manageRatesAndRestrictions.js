import * as dotenv from "dotenv";
dotenv.config();
import axios from 'axios'
import ratesAndRestrictions from '../../models/manageRatesAndRestrictions.js'
import OTARates from '../../models/manageOTARates.js';
import roomAndRateMap from '../../models/OTAs/mappedRoomsAndRates.js';
import checkRate from './checkAvailableRates.js';
import mmtModel from "../../models/OTAs/mmtModel.js"
import roomTypeModel from "../../models/roomType.js";
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
            days,
            otaId
        } = req.body

        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        const findModel = await mmtModel.findOne({ userId }).lean();
        if (!findModel) {
            return res.status(404).json({ message: "Invalid userId entered", statuscode: 404 })
        }
        const { mmtHotelCode, accessToken } = findModel

        if (result.success) {
            // Get today's date as a string in "yyyy-mm-dd" format
            const today = new Date().toISOString().split('T')[0];

            // Parse startDate as a Date object
            const startDateObj = new Date(startDate).toISOString().split('T')[0];

            // Parse startDate as a Date object
            const endDateObj = new Date(endDate).toISOString().split('T')[0];

            // Check if startDate is older than today's date
            if (startDateObj < today) {
                return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
            }

            const getRoomType = await roomTypeModel.findOne({ roomTypeId: roomTypeId }).select('baseAdult baseChild roomTypeId');
            const baseChild = parseInt(getRoomType.baseChild[0].baseChild);
            const baseAdult = parseInt(getRoomType.baseAdult[0].baseAdult);
            const occupancy = baseAdult + baseChild
            // console.log(occupancy, typeof occupancy)
            //update ota rates
            if (req.body.otaId) {
                const connectionId = req.body.connectionId
                // console.log("mmt")
                // Find the rate document for the specified roomTypeId
                let findOTA = await OTARates.findOne({ roomTypeId: roomTypeId, propertyId: propertyId, ratePlanId: ratePlanId, otaId: otaId });
                const findRecord = await roomAndRateMap.findOne({ otaId, connectionId: connectionId })
                if (!findRecord) {
                    return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
                }
                const existingEntryIndex = findRecord.mappedRatePlanData.findIndex(
                    (entry) => entry.ratePlanId === ratePlanId
                );

                const otaRatePlanCode = findRecord.mappedRatePlanData[existingEntryIndex].otaRatePlanCode
                // console.log(findRecord.mappedRatePlanData[existingEntryIndex].otaRatePlanCode)

                if (existingEntryIndex === -1) {
                    return res.status(400).json({ message: "Invalid ratePlanCode", statuscode: "400" });
                }

                // Create the inventory record if it doesn't exist
                if (!findOTA) {
                    findOTA = new OTARates({
                        roomTypeId: roomTypeId,
                        propertyId: propertyId,
                        ratePlanId: ratePlanId,
                        otaId: otaId,
                        source: source,
                        manageOTARates: {
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
                const apiUrl = process.env.mmtV3ARI


                for (let i = 0; i <= dayDifference; i++) {
                    const date = new Date(start);
                    date.setDate(date.getDate() + i);

                    const dateString = date.toISOString().split('T')[0];

                    // Check if the day of the week is in the included list
                    if (days) {
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                        if (!days.includes(dayOfWeek)) {
                            continue; // Skip updating rates for excluded days
                        }
                    }

                    // console.log(dateString)

                    if (isBaseRate) {
                        // Update the addedInventory array
                        const existingEntry = findOTA.manageOTARates.baseRate.find(entry => entry.date === dateString);

                        if (existingEntry) {
                            existingEntry.baseRate = baseRate;

                        } else {
                            // If the date does not exist, add a new entry to base rate array
                            findOTA.manageOTARates.baseRate.push({ date: dateString, baseRate: baseRate });
                        }

                        if (isBaseRate && i === 0) {
                            // console.log(111)
                            const daysArray = req.body.days

                            const validDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                            const filteredDaysArray = daysArray.filter(day => validDays.includes(day.toLowerCase()));

                            // Create a string representing the "sun", "mon", etc. values based on the sanitizedDaysArray
                            const daysString = validDays.map(day => {
                                const isPresent = filteredDaysArray.includes(day.toLowerCase());
                                return `${day.toLowerCase()}="${isPresent ? 'true' : 'false'}"`;
                            }).join(" ");

                            // console.log(daysString)
                            const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                                    <AvailRateUpdate locatorID="1">
                                        <DateRange from="${startDateObj}" to="${endDateObj}" ${daysString}/>
                                        <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                                            <PerOccupancyRates>
                                                <PerOccupancy occupancy="${occupancy}" rate="${baseRate}" />
                                            </PerOccupancyRates>
                                        </Rate>
                                    </AvailRateUpdate>
                                </AvailRateUpdateRQ>`;

                            console.log(xmlData)
                            // Set headers
                            const headers = {
                                'Content-Type': 'application/xml',
                                'channel-token': process.env.mmtChannelToken,
                                'bearer-token': accessToken,
                            };
                            // Make the Axios POST request
                            axios.post(apiUrl, xmlData, { headers })
                                .then(response => {
                                    console.log('API Response:', response.data);
                                    // return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
                                })
                                .catch(error => {
                                    console.error('Error making API request:', error.message);
                                    // return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
                                });
                        }

                    }

                    if (isExtraAdultRate) {
                        const existingEntry = findOTA.manageOTARates.extraAdultRate.find(entry => entry.date === dateString);

                        if (existingEntry) {
                            // If the date exists, update the blockedInventory
                            existingEntry.extraAdultRate = extraAdultRate;
                        } else {
                            // If the date does not exist, add a new entry to blockedInventory
                            findOTA.manageOTARates.extraAdultRate.push({ date: dateString, extraAdultRate: extraAdultRate });
                        }

                        if (isExtraAdultRate && i === 0) {
                            const daysArray = req.body.days

                            const validDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                            const filteredDaysArray = daysArray.filter(day => validDays.includes(day.toLowerCase()));

                            // Create a string representing the "sun", "mon", etc. values based on the sanitizedDaysArray
                            const daysString = validDays.map(day => {
                                const isPresent = filteredDaysArray.includes(day.toLowerCase());
                                return `${day.toLowerCase()}="${isPresent ? 'true' : 'false'}"`;
                            }).join(" ");

                            const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                                    <AvailRateUpdate locatorID="1">
                                        <DateRange from="${startDateObj}" to="${endDateObj}" ${daysString}/>
                                        <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                                        <AdditionalGuestRates>
                                        <AdditionalGuestRate type="Adult" rate="${extraAdultRate}" />
                                        </AdditionalGuestRates>
                                        </Rate>
                                    </AvailRateUpdate>
                                </AvailRateUpdateRQ>`;
                            // Set headers
                            const headers = {
                                'Content-Type': 'application/xml',
                                'channel-token': process.env.mmtChannelToken,
                                'bearer-token': accessToken,
                            };
                            // Make the Axios POST request
                            axios.post(apiUrl, xmlData, { headers })
                                .then(response => {
                                    console.log('API Response:', response.data);
                                    // return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
                                })
                                .catch(error => {
                                    console.error('Error making API request:', error.message);
                                    // return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
                                });
                        }
                    }

                    if (isExtraChildRate) {
                        const existingEntry = findOTA.manageOTARates.extraChildRate.find(entry => entry.date === dateString);

                        if (existingEntry) {
                            // If the date exists, update the blockedInventory
                            existingEntry.extraChildRate = extraChildRate;
                        } else {
                            // If the date does not exist, add a new entry to blockedInventory
                            findOTA.manageOTARates.extraChildRate.push({ date: dateString, extraChildRate: extraChildRate });
                        }

                        if (isExtraChildRate && i === 0) {
                            const daysArray = req.body.days

                            const validDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                            const filteredDaysArray = daysArray.filter(day => validDays.includes(day.toLowerCase()));

                            // Create a string representing the "sun", "mon", etc. values based on the sanitizedDaysArray
                            const daysString = validDays.map(day => {
                                const isPresent = filteredDaysArray.includes(day.toLowerCase());
                                return `${day.toLowerCase()}="${isPresent ? 'true' : 'false'}"`;
                            }).join(" ");

                            const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                            <AvailRateUpdate locatorID="1">
                                <DateRange from="${startDateObj}" to="${endDateObj}" ${daysString}/>
                                <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                                <AdditionalGuestRates>
                                <AdditionalGuestRate type="Child" ageRange="1" rate="${extraChildRate}" />
                                </AdditionalGuestRates>
                                </Rate>
                            </AvailRateUpdate>
                        </AvailRateUpdateRQ>`;
                            // Set headers
                            const headers = {
                                'Content-Type': 'application/xml',
                                'channel-token': process.env.mmtChannelToken,
                                'bearer-token': accessToken,
                            };
                            // Make the Axios POST request
                            axios.post(apiUrl, xmlData, { headers })
                                .then(response => {
                                    console.log('API Response:', response.data);
                                    // return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
                                })
                                .catch(error => {
                                    console.error('Error making API request:', error.message);
                                    // return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
                                });
                        }

                    }
                }

                // Save the updated inventory document
                await findOTA.save();
            } else {
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

            }

            const availableRates = await checkRate({
                query: {
                    userId,
                    propertyId,
                    startDate: startDate,
                    endDate: endDate,
                    status: true
                },
                headers: {
                    authcode: authCodeValue
                }

            }, res); // Pass the `res` object to the function

            // console.log(availableRates, "getRatesResponse");

            io.emit("ratesUpdated", availableRates);

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
import restrictions from '../../models/manageRestrictions.js';
import mmtModel from "../../models/OTAs/mmtModel.js"
import roomAndRateMap from '../../models/OTAs/mappedRoomsAndRates.js';
import axios from 'axios';
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const manageRestrictions = async (req, res, io) => {
    try {
        const { userId, propertyId, roomTypeId, startDate, ratePlanId, endDate, source, stopSell, isStopSell, isCOA, COA, isCOD, COD, isMinimumLOS, minimumLOS, isMaximumLOS, maximumLOS, days } = req.body;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
    

        if (result.success) {
            // Get today's date as a string in "yyyy-mm-dd" format
            const today = new Date()
            today.setHours(0, 0, 0, 0);
            const newToday = today.toISOString().split('T');
            // Parse startDate as a Date object
            const startDateObj = new Date(startDate).toISOString().split('T');
            const endDateObj = new Date(endDate).toISOString().split('T');
            // console.log(newToday, "today")
            // console.log(startDateObj, "star")

            // Check if startDate is older than today's date
            if (startDateObj < today) {
                return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
            }

            if (isMaximumLOS && isMinimumLOS) {
                if (maximumLOS < minimumLOS) {
                    return res.status(400).json({ message: "maximumLOS cannot be less than minimumLOS", statuscode: 400 });
                }
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
            const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));

            // Check if endDate is before startDate
            if (dayDifference < 0) {
                return res.status(400).json({ message: "End date cannot be before the start date", statuscode: 400 });
            }

            const connectionId = req.body.connectionId
            const findRecord = await roomAndRateMap.findOne({ otaId: req.body.otaId, connectionId: connectionId })
            if (!findRecord) {
                return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
            }
            const existingEntryIndex = findRecord.mappedRatePlanData.findIndex(
                (entry) => entry.ratePlanId === ratePlanId
            );

            const otaRatePlanCode = findRecord.mappedRatePlanData[existingEntryIndex].otaRatePlanCode

            if (req.body.otaId) {
                //
                const findModel = await mmtModel.findOne({ userId }).lean();
                if (!findModel) {
                    return res.status(404).json({ message: "Invalid userId entered", statuscode: 404 })
                }
                const { mmtHotelCode, accessToken } = findModel

                const apiUrl = process.env.mmtV3ARI
                if (isStopSell) {
                    const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                <AvailRateUpdate locatorID="1">
                    <DateRange from="${startDate}" to="${endDate}"/>
                    <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                        <Restrictions closed="true"/>
                    </Rate>
                </AvailRateUpdate>
            </AvailRateUpdateRQ>`

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

                if (isCOA) {
                    const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                <AvailRateUpdate locatorID="1">
                    <DateRange from="${startDate}" to="${endDate}"/>
                    <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                        <Restrictions  closedToArrival="true"/>
                    </Rate>
                </AvailRateUpdate>
            </AvailRateUpdateRQ>`

                    // console.log(xmlData)
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

                if (isCOD) {
                    const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                <AvailRateUpdate locatorID="1">
                    <DateRange from="${startDate}" to="${endDate}"/>
                    <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                        <Restrictions closedToDeparture="true"/>
                    </Rate>
                </AvailRateUpdate>
            </AvailRateUpdateRQ>`

                    // console.log(xmlData)
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

                if (isMaximumLOS) {
                    const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                <AvailRateUpdate locatorID="1">
                    <DateRange from="${startDate}" to="${endDate}"/>
                    <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                        <Restrictions maxLOSStaybased="${maximumLOS}" maxLOSArrivalbased="${maximumLOS}" />
                    </Rate>
                </AvailRateUpdate>
            </AvailRateUpdateRQ>`

                    // console.log(xmlData)
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

                if (isMinimumLOS) {
                    const xmlData = `<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
                <AvailRateUpdate locatorID="1">
                    <DateRange from="${startDate}" to="${endDate}"/>
                    <Rate currencyCode="INR" code="${otaRatePlanCode}" rateType="b2c">
                        <Restrictions minLOSStaybased="${minimumLOS}" minLosArrivalbased="${minimumLOS}" />
                    </Rate>
                </AvailRateUpdate>
            </AvailRateUpdateRQ>`

                    // console.log(xmlData,"bjh")
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

            // Loop through each day in the date range
            for (let i = 0; i <= dayDifference; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const dateString = date.toISOString().split('T')[0];

                // Check if the day of the week is in the excluded list
                if (days) {
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                    if (!days.includes(dayOfWeek)) {
                        continue; // Skip updating rates and restrictions for excluded days
                    }
                }

                if (isStopSell) {
                    const existingEntry = findRestrictions.manageRestrictions.stopSell.find(entry => entry.date === dateString);
                    if (existingEntry) {
                        existingEntry.stopSell = stopSell;
                    } else {
                        findRestrictions.manageRestrictions.stopSell.push({ date: dateString, stopSell: stopSell });
                    }

                    if (isStopSell && i === 0) {

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

            // const emitData = async () => {
            //     try {
            //         const getInventoryResponse = await axios.get(`https://api.hotelratna.com/api/getInventory?userId=${userId}&propertyId=${propertyId}&checkInDate=${startDate}&checkOutDate=${endDate}`, {
            //             headers: {
            //                 'authcode': authCodeValue
            //             }
            //         });

            //         // Emit the response to connected clients via Socket.io
            //         io.emit("inventoryUpdated", getInventoryResponse.data);
            //     } catch (error) {
            //         console.error(error);
            //     }
            // };

            // // Use the asynchronous function to emit data
            // emitData();

            return res.status(200).json({ message: "Restrictions updated successfully", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
};

export default manageRestrictions;
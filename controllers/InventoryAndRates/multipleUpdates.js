import axios from 'axios'
import manageRestrictions from "./manageRestrictions.js";
import manageInventory from './manageInventory.js';
import manageRates from "./manageRatesAndRestrictions.js";

const multipleUpdatesARI = async (req, res) => {

    try {

        const authCodeValue = req.headers['authcode'];
        const { isInventoryUpdate, isRateUpdate, isRestrictionsUpdate, userId,
            propertyId,
            roomTypeId,
            startDate,
            endDate,
            isAddedInventory,
            isBlockedInventory,
            baseRate,
            extraAdultRate,
            inventory,
            source,
            otaId,
            days } = req.body;
        const apiUrl = process.env.mmtV3ARI
        if (isInventoryUpdate) {
            if (isAddedInventory) {
                const updateInventory = await manageInventory({
                    body: {
                        userId,
                        propertyId,
                        startDate,
                        endDate,
                        roomTypeId,
                        inventory,
                        otaId
                    },
                    query: {
                        status: true
                    },
                    headers: {
                        authcode: authCodeValue
                    }
                }, req, res)
                console.log(updateInventory)
                console.log("done")
                const xmlData = `<AvailRateUpdateRQ hotelCode="1000282881" timeStamp="">
                <AvailRateUpdate locatorID="1">
                <DateRange from="2023-11-19" to="2023-11-30"/>
               <Availability code="45000485844" count="6" closed="false" />
                <Rate currencyCode="INR" code="990001678682" rateType="b2c">
                <PerOccupancyRates>
                <PerOccupancy occupancy="1" rate="${baseRate}" />
               
                </PerOccupancyRates>
                <AdditionalGuestRates>
                <AdditionalGuestRate type="Adult" rate="${extraAdultRate}" />
               
                </AdditionalGuestRates>
                </Rate>
                </AvailRateUpdate>
               </AvailRateUpdateRQ>`;
                console.log(xmlData)
                // Set headers
                const headers = {
                    'Content-Type': 'application/xml',
                    'channel-token': process.env.mmtChannelToken,
                    'bearer-token': '7ca3675c8d',
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

                return res.send("done")
            }
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default multipleUpdatesARI
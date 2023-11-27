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
            rateValues,
            ratePlanIds,
            extraAdultRates,
            extraChildRates,
            closed,
            COA,
            COD,
            minLOS,
            maxLOS,
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
                // const ratePlanIds = ['rate1', 'rate2']; // Example array of ratePlanIds
                let xmlData = `<AvailRateUpdateRQ hotelCode="1000282881" timeStamp="">
    <AvailRateUpdate locatorID="1">
        <DateRange from="${startDate}" to="${endDate}"/>`;

                // Iterate over ratePlanIds
                for (let i = 0; i < ratePlanIds.length; i++) {
                    const ratePlanId = ratePlanIds[i];
                    const rateValue = rateValues[i];
                    const extraChildValue = extraChildRates[i]
                    const extraAdultValue = extraAdultRates[i]
                    // Example XML structure for each ratePlanId
                    const ratePlanXml = `
        <Rate currencyCode="INR" code="${ratePlanId}" rateType="b2c">
            <PerOccupancyRates>
                <PerOccupancy occupancy="1" rate="${rateValue}" />
            </PerOccupancyRates>
            <AdditionalGuestRates>
                <AdditionalGuestRate type="Adult" rate="${extraAdultValue}" />
                <AdditionalGuestRate type="Child" ageRange="1" rate="${extraChildValue}" />
            </AdditionalGuestRates>
            <Restrictions closed="${closed}" closedToArrival="${COA}" closedToDeparture="${COD}" minLOSStaybased="${minLOS}" 
 maxLOSStaybased="${maxLOS}" />
        </Rate>`;

                    // Append the ratePlanXml to the main XML data
                    xmlData += ratePlanXml;
                }

                // Close the XML structure
                xmlData += `</AvailRateUpdate>
</AvailRateUpdateRQ>`;

                console.log(xmlData);
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
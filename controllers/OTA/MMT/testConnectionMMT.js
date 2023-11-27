import axios from 'axios'
import mmtModel from "../../../models/OTAs/mmtModel.js"
import { findUserByUserIdAndToken } from '../../../helpers/helper.js'

const testMMTConnection = async (req, res) => {
    try {
        const { userId, otaHotelCode } = req.query
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode })
        }

        const findModel = await mmtModel.findOne({ userId }).lean();
        if (!findModel) {
            return res.status(404).json({ message: "Invalid userId entered", statuscode: 404 })
        }
        const { accessToken } = findModel

        const apiUrl = 'https://ppin-mmt.goibibo.com/api/chmv2/gethotellisting'
        // Your XML data
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
        <Website Name="ingoibibo" HotelCode= "${otaHotelCode}">
         <HotelCode>${otaHotelCode}</HotelCode>
         <IsOccupancyRequired>false</IsOccupancyRequired>
        </Website>`;

        // console.log(xmlData)

        // Set headers
        const headers = {
            'Content-Type': 'application/xml',
            'channel-token': process.env.mmtChannelToken,
            'bearer-token': accessToken,
        };

        // console.log(headers, "headers")

        // Make the Axios POST request
        axios.post(apiUrl, xmlData, { headers })
            .then(response => {
                // console.log('API Response:', response.data);
                return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
            })
            .catch(error => {
                console.error('Error making API request:', error);
                return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default testMMTConnection;
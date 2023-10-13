import Randomstring from 'randomstring';
import * as dotenv from 'dotenv';
dotenv.config();
import propertyChainModel from '../../models/propertyChain.js'
import { getCurrentUTCTimestamp, uploadImageToS3, getCurrentLocalTimestamp } from '../../helpers/helper.js'

//upload property controller
const postPropertyChain = async (req, res) => {
    try {
        const { userId,
            country,
            state,
            city,
            baseCurrency,
            websiteUrl,
            propertyChainName,
            propertyType,
            numberOfProperties,
            propertyTypeName
        } = req.body

        var hotelLogoId = Randomstring.generate(8)

        let imageUrl = null; // Initialize imageUrl to null
        if (req.file) {
            imageUrl = await uploadImageToS3(req.file);
        }

        //create record
        const newPropertyChain = new propertyChainModel({
            userId,
            propertyChainId: Randomstring.generate(8),
            country,
           
            numberOfProperties: [{
                numberOfProperties: numberOfProperties,
                modifiedDate: getCurrentUTCTimestamp()
            }],
            state: [{
                state: state,
                modifiedDate: getCurrentUTCTimestamp()
            }],
            city: [{
                city,
                modifiedDate: getCurrentUTCTimestamp()
            }],
            hotelLogo: imageUrl
                ? [{
                    hotelLogoId,
                    hotelLogo: imageUrl,
                    modifiedDate: getCurrentUTCTimestamp(),
                }]
                : [],
            baseCurrency,
            websiteUrl,
            propertyChainName: [{
                propertyChainName: propertyChainName,
                modifiedDate: getCurrentUTCTimestamp()
            }],
            propertyType,
            dateUTC: getCurrentUTCTimestamp(),
            dateLocal: getCurrentLocalTimestamp(),
            propertyTypeName
        })


        await newPropertyChain.save();

        return res.status(200).json({ message: "New property chain added successfully", statuscode: 200 });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default postPropertyChain;

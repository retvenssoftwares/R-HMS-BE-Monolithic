import randomstring from 'randomstring'
import userModel from '../../models/user.js'
import * as dotenv from "dotenv";
dotenv.config();
import sgMail from '@sendgrid/mail';
import {
    getCurrentUTCTimestamp,
    uploadImageToS3,
} from "../../helpers/helper.js";

const editUserOnboarding = async (req, res) => {
    const propertyId = randomstring.generate({ charset: 'numeric', length: 6 });
    const { userId, propertyTypeSOC } = req.body;
    var findRecord = await userModel.findOne({ userId });
    // Find the specific array element you want to update
    if (!findRecord) {
        return res.status(404).json({ message: "user not found", statuscode: 404 })
    }
    const hotelRCode = findRecord.hotelRcode;
    try {
        if (propertyTypeSOC === 'Single') {
            const { propertyAddress1, propertyName, propertyType, propertyTypeName, postCode, country, state, city, starCategory, ratePercent, baseCurrency, websiteUrl, roomsInProperty, taxName, registrationNumber } = req.body

            const elementToUpdate = findRecord.singlePropertyDetails[0];
            let imageUrl = ''
            if (req.file) {
                imageUrl = await uploadImageToS3(req.file)
                const hotelLogoObject = {
                    hotelLogoId: randomstring.generate(8),
                    hotelLogo: imageUrl,
                    modifiedDate: (await getCurrentUTCTimestamp()).toString()
                }
                elementToUpdate.hotelLogo.unshift(hotelLogoObject)
            }

            const propertyNameObject = {
                propertyName: propertyName,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.propertyName.unshift(propertyNameObject)

            elementToUpdate.propertyTypeName = propertyTypeName;
            elementToUpdate.propertyType = propertyType
            elementToUpdate.starCategory = starCategory;

            elementToUpdate.roomsInProperty = roomsInProperty;
            elementToUpdate.taxName = taxName;
            elementToUpdate.registrationNumber = registrationNumber;

            elementToUpdate.ratePercent = ratePercent;
            // Add similar conditions for other fields

            const propertyAddressObject = {
                propertyAddress1: propertyAddress1,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.propertyAddress1.unshift(propertyAddressObject);
            const postCodeObject = {
                postCode: postCode,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }

            elementToUpdate.postCode.unshift(postCodeObject);
            const stateObject = {
                state: state,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.state.unshift(stateObject);
            const cityObject = {
                city: city,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.city.unshift(cityObject);

            elementToUpdate.country = country

            const propertyDescriptionObject = {
                propertyDescription: req.body.propertyDescription,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.propertyDescription.unshift(propertyDescriptionObject);
            elementToUpdate.userId = userId;
            elementToUpdate.dateUTC = (await getCurrentUTCTimestamp()).toString();
            elementToUpdate.baseCurrency = baseCurrency
            elementToUpdate.websiteUrl = websiteUrl
            elementToUpdate.country = country
            elementToUpdate.hotelRCode = hotelRCode
            elementToUpdate.propertyId = propertyId
            findRecord.propertyTypeSOC = propertyTypeSOC
            await findRecord.save();

            //send mail for single property
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: findRecord.email, // Change to your recipient
                from: process.env.senderEmail, // Change to your verified sender
                // subject: 'Sending with SendGrid is Fun',
                // text: 'and easy to do anywhere, even with Node.js and ReactJs',
                // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                templateId: process.env.template_ID,
                dynamicTemplateData: {
                    username: findRecord.username[0].username || '',
                    text_here: `Congratulations! You have successfully registered your Hotel '${propertyName}' with us.We just need to check a few things first, we will let you know when your one stop hotel solution is ready to go.`,
                }
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
                return res.status(200).json({
                    message: "User updated successfully",
                    propertyName: findRecord.singlePropertyDetails[0].propertyName[0].propertyName,
                    statuscode: 200
                });
        } else {
            const { userId, propertyChainName, numberOfProperties, propertyType, baseCurrency, websiteUrl } = req.body
            var findRecord = await userModel.findOne({ userId });
            //console.log(findRecord)
            var email = findRecord.email
            // console.log(email)
            const elementToUpdate = findRecord.multipleData[0];
            let imageUrl = ''
            if (req.file) {
                imageUrl = await uploadImageToS3(req.file)
                const hotelLogoObject = {
                    hotelLogoId: randomstring.generate(8),
                    hotelLogo: imageUrl,
                    modifiedDate: (await getCurrentUTCTimestamp()).toString()
                }
                elementToUpdate.hotelLogo.unshift(hotelLogoObject)
            }


            const propertyChainNameObject = {
                propertyChainName: propertyChainName,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }

            elementToUpdate.propertyChainName.unshift(propertyChainNameObject)

            const numberOfPropertiesObject = {
                numberOfProperties: numberOfProperties,
                modifiedDate: (await getCurrentUTCTimestamp()).toString()
            }
            elementToUpdate.numberOfProperties.unshift(numberOfPropertiesObject)

            elementToUpdate.userId = userId;
            const propertyChainId = randomstring.generate(8)
            elementToUpdate.propertyChainId = propertyChainId
            elementToUpdate.dateUTC = (await getCurrentUTCTimestamp()).toString();

            elementToUpdate.baseCurrency = baseCurrency
            elementToUpdate.propertyType = propertyType
            elementToUpdate.hotelRCode = hotelRCode
            elementToUpdate.websiteUrl = websiteUrl
            findRecord.propertyTypeSOC = "Multiple"
            await findRecord.save();

            //send mail for single property
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: process.env.senderEmail, // Change to your verified sender
                // subject: 'Sending with SendGrid is Fun',
                // text: 'and easy to do anywhere, even with Node.js and ReactJs',
                // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                templateId: process.env.template_ID,
                dynamicTemplateData: {
                    username: findRecord.username[0].username || '',
                    text_here: `Congratulations! You have successfully registered your Hotel Chain '${propertyChainName}' with us.We just need to check a few things first, we will let you know when your one stop hotel solution is ready to go.`,
                }
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        return res.status(200).json({
            message: "User updated successfully",
            propertyChainName: findRecord.multipleData[0].propertyChainName[0].propertyChainName,
            statuscode: 200
        });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default editUserOnboarding


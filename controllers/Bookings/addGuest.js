import randomstring from 'randomstring'
import addguest from '../../models/guestDetails.js'
import { getCurrentUTCTimestamp, encrypt } from "../../helpers/helper.js"
import guestLogs from "../../models/LogModels/guestLogs.js"
const addUser = async (req, res) => {
    try {


       const {salutation ,guestName, phoneNumber, emailAddress,addressLine1, addressLine2, country, state , city , pinCode} = req.body

        const newData = new addguest({
            guestId : randomstring.generate(10),

            salutation :[{
                salutation : salutation,
                logId :randomstring.generate(10)
            }],

            guestName:[{
                guestName :guestName,
                logId :randomstring.generate(10)
            }],

            phoneNumber :[{
                phoneNumber : phoneNumber,
                logId :randomstring.generate(10)
            }],

            emailAddress :[{
                emailAddress : emailAddress,
                logId : randomstring.generate(10)
            }],

            addressLine1 :[{
                addressLine1 : addressLine1,
                logId : randomstring.generate(10)
            }],

            addressLine2:[{
                addressLine2 :addressLine2,
                logId : randomstring.generate(10)
            }],

            country :[{
                country : country,
                logId : randomstring.generate(10)
            }],

            state:[{
                state : state,
                logId : randomstring.generate(10)
            }],

            city:[{
                city : city,
                logId : randomstring.generate(10)
            }],

            pinCode:[{
                pinCode : pinCode,
                logId : randomstring.generate(10)
            }]
        
        })
        const userData = await newData.save()

        // save data in logs
        const addGuestLogs=new guestLogs({
            guestId : userData.guestId,
            salutation :[{
                salutation : userData.salutation,
                logId :userData.salutation[0].logId
            }],

            guestName:[{
                guestName : userData.guestName,
                logId :userData.guestName[0].logId
            }],

            phoneNumber :[{
                phoneNumber : userData.phoneNumber,
                logId :userData.phoneNumber[0].logId
            }],

            emailAddress :[{
                emailAddress :  userData.emailAddress,
                logId :userData.emailAddress[0].logId
            }],

            addressLine1 :[{
                addressLine1 :  userData.addressLine1,
                logId :userData.addressLine1[0].logId
            }],

            addressLine2:[{
                addressLine2 : userData.addressLine2,
                logId :userData.addressLine2[0].logId
            }],

            country :[{
                country :  userData.country,
                logId :userData.country[0].logId
            }],

            state:[{
                state :  userData.state,
                logId :userData.state[0].logId
            }],

            city:[{
                city :  userData.city,
                logId :userData.city[0].logId
            }],

            pinCode:[{
                pinCode :  userData.pinCode,
                logId :userData.pinCode[0].logId
            }]

        })
        await addGuestLogs.save()

        return res.status(200).json({ message: "guest successfully added", statuscode: 200 })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default addUser
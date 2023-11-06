import randomstring from 'randomstring'
import addguest from '../../models/guestDetails.js'
import { getCurrentUTCTimestamp, encrypt } from "../../helpers/helper.js"
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

        return res.status(200).json({ message: "guest successfully added", statuscode: 200 })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default addUser
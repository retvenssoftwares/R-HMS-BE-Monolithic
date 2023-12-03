import folio from "../../models/folio.js"
import Randomstring from "randomstring"
export const billingPreferences = async (req, res) => {

    try {
        const { folioNo, propertyId, billTo, nameOnFolio, gstinNo } = req.body

        if (!propertyId || !folioNo) {
            return res.status(404).json({ message: "some fields are missing", statusCode: 404 })
        }


        const folioDetails = await folio.findOne({ folioNo: folioNo, propertyId })

        if(!folioDetails){
            return res.status(404).json({ message: "Data not dound", statusCode: 404 })
        }

        const update = await folio.updateOne(
            { folioNo: folioNo, propertyId },
            {
                $set: {
                    billingPreferences: [{
                        billTo: billTo,
                        nameOnFolio: nameOnFolio,
                        gstinNo: gstinNo,
                        logId: Randomstring.generate(7)
                    }]
                }

            }

        )
        if (update) {
            return res.status(200).json({ message: `folioNumber ${folioNo} transfered balance to ${gstinNo}`, statusCode: 200 })
        }


    } catch (err) {
        return res.status(500).json({ message: "something wrong", statusCode: 500 })
    }




}
import folio from "../../models/folio.js"

export const settleFolio = async (req, res) => {

    try {
        const { folioNo, propertyId } = req.body

        if (!propertyId || !folioNo) {
            return res.status(404).json({ message: "some fields are missing", statusCode: 404 })
        }


        const folioDetails = await folio.findOne({ folioNo: folioNo, propertyId })

        if(!folioDetails){
            return res.status(404).json({ message: "Data not dound", statusCode: 404 })
        }

        if (folioDetails.totalBalance === 0) {
            return res.status(200).json({ message: "first make your balance zero" })
        } else {
            await folio.updateOne(
                { folioNo: folioNo, propertyId },

                {
                    $set: {
                        isSettleFolio: "true"
                    }

                }

            )
        }

    }catch(err){
        return res.status(500).json({ message: "something wrong", statusCode: 500})
    }

    


}
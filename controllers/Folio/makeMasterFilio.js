import folio from "../../models/folio.js"

export const makeMasterFolio = async (req, res) => {

    try {

        const {propertyId, folioNo } = req.body

        if(!propertyId || !folioNo){
            return res.status(404).json({message : "some fields are missing", statusCode:404})
        }

        const folioDetails = await folio.find({ propertyId: propertyId })

        if(!folioDetails){
            return res.status(404).json({ message: "Data not dound", statusCode: 404 })
        }

        folioDetails.forEach(async (item) => {
            if (item.isMasterFolio === "true") {
                await folio.findOneAndUpdate(
                    { folioNo: item.folioNo },
                    {
                        $set: {
                            isMasterFolio: "false"
                        }
                    }
                )
            }
        })

        const update = await folio.findOneAndUpdate(
            { folioNo: folioNo, propertyId },
            {
                $set: {
                    isMasterFolio: "true"
                }
            }
        )

        if (update) {
            return res.status(200).json({ message: `folioNumber ${folioNo} is a modified as master folio`, statusCode: 200 })
        }

    } catch (err) {
        return res.status(500).json({ message: "something wrong", statusCode: 500 })
    }




}
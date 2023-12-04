import folio from "../../models/folio.js"
import bookings from "../../models/confirmBooking.js"

export const closeFolio = async (req, res) => {

    const { folioNo } = req.body

    

    await folio.updateOne(
        { folioNo: folioNo },

        {
            $set: {
                isSettleFolio: "true"
            }

        }

    )



}
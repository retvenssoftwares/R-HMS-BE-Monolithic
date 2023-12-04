import folio from "../../models/folio.js"
import Randomstring from "randomstring"

export const createFolio = (async(req,res)=>{

    const {propertyId , reservationNumber,  reservationIds} = req.body

    if(!propertyId || !reservationNumber ||  !reservationIds){
        return res.status(404).json({message : "some fields are missing",statusCode : 404})
    }

    const addFolio = new folio({
        folioNo : Randomstring.generate({ charset: 'numeric', length: 6 }),

        propertyId : propertyId,

        reservationNumber : reservationNumber,

        totalBalance : 0,

        reservationIds : reservationIds,

    })
    
    if(addFolio){
        await addFolio.save()
        return res.status(200).json({message : `folio created Successfully with folioNo ${addFolio.folioNo}` , statusCode : 200})
    }

})
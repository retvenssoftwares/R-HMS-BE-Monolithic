import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import companyLedger from "../../models/companyLedger.js";

export const companyLedgerDetails = async(req,res)=>{

    const {userId,companyId,propertyId} = req.query

    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if(!result.success){
        return res.status(404).json({message : "Invalid token" , statusCode : 404})
    }

    const company = await companyLedger.findOne({companyId :companyId, propertyId}).sort({_id:-1})

    if(!company){
        return res.status(404).json({message : "Data not found" , statusCode : 404})
    }

    return res.status(200).json({data : company.ledger , statusCode : 200})


}
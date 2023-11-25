import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import companyLedger from "../../models/companyLedger.js";

export const companyLedgerDetails = async(req,res)=>{

    const {userId,companyId} = req.query

    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if(!result.success){
        return res.status(404).json({message : "Invalid token" , statusCode : 404})
    }

    const company = await companyLedger.findOne({companyId :companyId})

    const credit = company.ledger[0].ledger[0].amount || "" 

    const debit = "0"
                                                                    
    const total = credit - debit
    

    const companyDetails  = {

        date : company.date,    

        particular : company.ledger[0].ledger[0].particular || "",

        voucherNo :  company.ledger[0].ledger[0].voucher[0].voucherNo || "",

        vocherLink : company.ledger[0].ledger[0].voucher[0].vocherLink || "",

        creadit : company.ledger[0].ledger[0].amount || "",

        debit : "",

        totalBalance : total.toString()


    }

    return res.status(200).json({data : companyDetails , statusCode : 200})


}
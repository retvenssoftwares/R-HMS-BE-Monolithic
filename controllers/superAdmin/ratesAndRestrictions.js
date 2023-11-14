import ratesAndRestrictions from "../../models/superAdmin/ratesAndRestrictionModel.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";

const rate =async(req,res)=>{
    try{
        const { name }= req.body; 
         const newRate = new ratesAndRestrictions({
            name,
            createdOn: await getCurrentUTCTimestamp()
     });
     newRate.save();
     return res.status(200).json({ message: "rates successfully added", statuscode: 200 })

    }catch(err)
    {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export default rate;
import ratesAndRestrictions from "../../models/superAdmin/ratesAndRestrictionModel.js";

const rateName=async(req,res)=>{
    try{
        const rateTypes = await ratesAndRestrictions.find({}).select("name -_id").lean();
        return res.status(200).json({data:rateTypes , statusCode: 200});

    }catch(error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
}

export default rateName;
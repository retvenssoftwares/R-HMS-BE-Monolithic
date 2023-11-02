import * as dotenv from "dotenv";
dotenv.config();
import designationTypeModel from "../../models/superAdmin/designation.js";

const getDesignation = async (req, res) => {
        try{
            const designation = await designationTypeModel.find({}).select('designation designationId').lean();
            return res.status(200).json({data:designation , statusCode: 200});

        }catch (error) {
            return res.status(500).json({ error: error.message, statusCode: 500 });
        }
};

export default getDesignation;
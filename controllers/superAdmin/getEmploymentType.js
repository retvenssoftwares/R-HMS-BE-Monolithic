import * as dotenv from "dotenv";
dotenv.config();
import employmentTypeModel from "../../models/superAdmin/employmentType.js";

const getEmploymentType = async (req, res) => {
      try{
        const employmentType = await employmentTypeModel.find({}).select('employmentId employmentTypeName -_id').lean();
        return res.status(200).json({data: employmentType , statusCode: 200});
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getEmploymentType;
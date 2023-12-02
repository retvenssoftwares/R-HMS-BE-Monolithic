import * as dotenv from "dotenv";
dotenv.config();
import departmentModel from "../../models/superAdmin/department.js";

const getDepartmentRule = async (req, res) => {
      try{
        const departmentRules = await departmentModel.find({}).select(' departmentId departmentName -_id').lean();
        return res.status(200).json({data: departmentRules , statusCode: 200});
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getDepartmentRule;
import * as dotenv from "dotenv";
dotenv.config();
import idTypeModel from "../../models/superAdmin/idType.js";

const getIdType = async (req, res) => {
      try{
        const idType = await idTypeModel.find({}).select('idTypeId idName -_id').lean();
        return res.status(200).json({data: idType , statusCode: 200});
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getIdType;
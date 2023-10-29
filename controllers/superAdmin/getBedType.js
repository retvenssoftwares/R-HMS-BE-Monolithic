import * as dotenv from "dotenv";
dotenv.config();
import bedTypeModel from "../../models/superAdmin/bedType.js";

const getBedType = async (req, res) => {
        try{
            const bedTypes = await bedTypeModel.find({}).select('bedTypeId bedType -_id').lean();
            return res.status(200).json({bedTypes , statusCode: 200});

        }catch (error) {
            return res.status(500).json({ error: error.message, statusCode: 500 });
        }
};

export default getBedType;
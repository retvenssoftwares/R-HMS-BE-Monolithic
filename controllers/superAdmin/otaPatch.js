import otaModel from "../../models/superAdmin/otaModel.js";

const otaPatch = async (req, res) => {
  try {
    const findOta = await otaModel.findOneAndUpdate({ "otaId.otaId": otaId },{$set:{isConfig:"true"}},{new:true});
  
    if (!findOta) {
      return res.status(404).json({ message: "OTA not found", statuscode: 404 });
    } else {
        await findOta.save();
        return res.status(200).json({ message:"config is updated", statuscode:200});
    }
  } catch (error) {
    return res
      .status(500)

      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default otaPatch;

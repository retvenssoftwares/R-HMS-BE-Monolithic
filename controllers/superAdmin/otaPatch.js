import otaModel from "../../models/superAdmin/otaModel.js";

const otaPatch = async (req, res) => {
  try {
    const { otaId }  =req.query;
    var isConfig="false"
    console.log(isConfig)
    console.log(otaId);
    const findOta = await otaModel.findOneAndUpdate({ otaId: otaId },{$set:{isConfig:isConfig}},{new:true});
    console.log(findOta)
    if (!findOta) {
      return res.status(404).json({ message: "ota not found", statuscode: 404 });
    } else {
        await findOta.save();
        return res.status(200).json({ message:"config is updated", statuscode:200});
    }
  } catch (error) {
    console.log(error)
    return res
      .status(500)

      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default otaPatch;

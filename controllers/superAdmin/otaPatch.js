import otaModel from "../../models/superAdmin/otaModel.js";

const otaPatch = async (req, res) => {
  const { otaId } = req.query;
  try {
    const findOta = await otaModel.findOne({ "otaId.otaId": otaId },{isConfig:"true"});
    console.log(findOta )
    if (!findOta) {
      return res.status(404).json({ message: "User not found", statuscode: 404 });
    } else {
        return res.status(200).json({ message:"config is updated", statuscode:200});
    }
  } catch (error) {
    console.error("Error in updating", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default otaPatch;

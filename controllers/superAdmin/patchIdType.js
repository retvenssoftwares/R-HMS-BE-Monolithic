import idTypeModel from "../../models/superAdmin/idType.js";

const patchIdType = async (req, res) => {
    try {
      const {idTypeId}=req.query;
      const { idName, displayStatus} = req.body;
      const findIdType = await idTypeModel.findOneAndUpdate({ idTypeId },{$set:{isConfig:"true", idName: idName, displayStatus: displayStatus}},{new:true});
    
      if (!findIdType) {
        return res.status(404).json({ message: "Id type not found", statuscode: 404 });

      } else {
          await findIdType.save();
          return res.status(200).json({ message:"Id Type is updated", statuscode:200});
      }
    } catch (error) {
        console.log(error)
      return res
        .status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
  };
  
  export default patchIdType;
import employmentTypeModel from "../../models/superAdmin/employmentType.js";

const employmentType = async (req, res) => {
    try {
      const {employmentId}=req.query;
      const { employmentTypeName, displayStatus} = req.body;
      const findEmploymentType = await employmentTypeModel.findOneAndUpdate({ employmentId },{$set:{isConfig:"true", employmentTypeName: employmentTypeName, displayStatus: displayStatus}},{new:true});
    
      if (!findEmploymentType) {
        return res.status(404).json({ message: "employment Type not found", statuscode: 404 });

      } else {
          await findEmploymentType.save();
          return res.status(200).json({ message:"employment Type is updated", statuscode:200});
      }
    } catch (error) {
        console.log(error)
      return res
        .status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
  };
  
  export default employmentType;
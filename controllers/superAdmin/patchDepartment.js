import departmentTypeModel from "../../models/superAdmin/department.js";

const patchDepartment = async (req, res) => {
    try {
      const {departmentId}=req.query;
      const { departmentName, displayStatus} = req.body;
      const findDepartment = await departmentTypeModel.findOneAndUpdate({ departmentId },{$set:{isConfig:"true", departmentName: departmentName, displayStatus: displayStatus}},{new:true});
    
      if (!findDepartment) {
        return res.status(404).json({ message: "Department not found", statuscode: 404 });

      } else {
          await findDepartment.save();
          return res.status(200).json({ message:"Department is updated", statuscode:200});
      }
    } catch (error) {
        console.log(error)
      return res
        .status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
  };
  
  export default patchDepartment;
import roomStatusModel from "../../models/roomStatus";

const roomStatus = async (req,req)=>{
try{

}catch(error){
    console.log(err);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
}
}
export default roomStatus
import loginUserModel from "../../models/verifiedUsers.js"

const loginUser = async (req, res) => {
       try{
        const { userId } = req.body
        const findUser = await loginUserModel.findOne({ userId })
        if (!findUser || !userId) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

           const login = await loginUserModel.updateOne({ userId: userId },
                
                    { $set: { isLogin : "true" } },     
                
            )
            //const user = await login.save()
             return res.status(200).json({ isLogin:login.isLogin, statuscode: 200 });
         
       }catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}; 
export default loginUser 
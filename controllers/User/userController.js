import userModel from '../../models/user.js'
import {jwtsign} from "../../helpers/helper.js"
const postUser = async (req, res) => {
    const newData = new userModel ({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        designation : req.body.designation,
        phoneNumber : req.body.phoneNumber,
        email : req.body.email,
        password : req.body.password
    })
    const payload = {
        password : req.body.password
    }
    jwtsign(payload)

    await newData.save()
}
export default postUser
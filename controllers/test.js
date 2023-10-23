import { testModel1, testModel2 } from "../models/testModel.js"

const postTestData = async (req, res) => {
    try {

        const pushObj = {
            email: req.body.email,
            name: req.body.name
        }
        const createData = new testModel1(pushObj)
        const createDataLog = new testModel2(pushObj)
        await createData.save();
        await createDataLog.save();
        res.status(200).json({ message: "yes done" })
    } catch (error) {
        console.log(error)
    }
}

export default postTestData
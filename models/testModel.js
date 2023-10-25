import mongoose from "mongoose"
import db1 from "../db/conn.js"
import db2 from "../db/conn2.js"

const testSchema = new mongoose.Schema({
    email: {
        type: String
    },
    name: String
})

const testModel1 = db1.model("userdetails", testSchema);
const testModel2 = db2.model("userdetails", testSchema);

export { testModel1, testModel2 }

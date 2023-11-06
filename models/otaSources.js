import mongoose from 'mongoose'
import db1 from '../db/conn.js'

const otaSources = mongoose.Schema({
    otaId: { type: String, default: "" },
    otaName: [{
        otaName: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],
   
})

const otaSourcesModel = db1.model("otaSources", otaSources)
export default otaSourcesModel
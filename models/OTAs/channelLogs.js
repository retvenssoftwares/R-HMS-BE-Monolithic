import mongoose from "mongoose"; 
import db1 from '../../db/conn.js';

const channelLogsSchema = mongoose.Schema({

})

const channelLogsModel = new mongoose.model("channelLogs", channelLogsSchema);
export default channelLogsModel
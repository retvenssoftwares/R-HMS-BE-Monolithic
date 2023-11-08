import { mongoose } from "mongoose";
import db1 from "../../db/conn.js";
const otaModel = new mongoose.Schema({

      otaName: [{
        otaName:{
          type: String,
          default: "",
        }
      }],
      otaId: [{
        otaId:{
          type: String,
          default: "",
        }
      }],
      otaLogo: [{
       otaLogo:{
        type: String,
        default: "",
       }
      }],
      createdOn:{
        type: String,
        default: "",
      },
      isConfig:[{
        isConfig:{
          type: String,
          default: "false",
        }
      }]
 
});
const ota = db1.model("ota", otaModel);
export default ota;

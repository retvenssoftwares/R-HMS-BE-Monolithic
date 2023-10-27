import mongoose, { Mongoose , Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const logs = new mongoose.Schema({
    propertyId:{
        type:String,
        default:""
    },

    data:[{
        companyInfo:[{
                logId:{
                   type:String,
                   default:""
                },
                fieldName:{
                    type:String,
                    require:true,
                   default:""
                },
                lasteModifiedAt:{
                    type:String,
                    default:""
                },
                lasteModifiedBy:{
                    type:String,
                    default:""
                },
                userId:{
                    type:String,
                    default:""
                },
                lastValue:{
                    type:String,
                    default:""
                },
                currentValue:{
                   type:String,
                   default:""
                },
                deviceType:{
                    type:String,
                    default:""
                },
                ipAddress:{
                    type:String,
                    default:""
                }
        }],
        propertyInfo:[{
            logId:{
                type:String,
                default:""
             },
             fieldName:{
                 type:String,
                 require:true,
                default:""
             },
             lasteModifiedAt:{
                 type:String,
                 default:""
             },
             lasteModifiedBy:{
                 type:String,
                 default:""
             },
            //  userId:{
            //      type:String,
            //      default:""
            //  },
             lastValue:{
                 type:String,
                 default:""
             },
             currentValue:{
                type:String,
                default:""
             },
             deviceType:{
                 type:String,
                 default:""
             },
             ipAddress:{
                 type:String,
                 default:""
             }
        }]
    }]
})


const logsModel = db1.model("logsModel",logs)
export default logsModel
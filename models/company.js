import { mongoose,Schema, model } from "mongoose";

const companyInfoSchema = new mongoose.Schema({
    companyId:{
        type:String,
        default:""
    },
    companyLogo:{
        type:String,
        default:""
    },
    companyName: {
        type: String,
        default: ""
    },
    companyType:{
        type: String,
        default: ""
    },
    registrationNumber:{
        type: String,
        default: ""
    },
    taxId:{
        type:String,
        default:""
    },
    accountDetails:[{
        opeaningBalance :{
            type:String,
            default:""
        },
        creditLimit :{
            type:String,
            default:""
        },
        billingCycleMonths:{
            type:String,
            default:""
        },
        billingCycleDays:{
            type:String,
            default:""
        },
        creditLimit:{
            type:String,
            default:""
        },

   
    }],
    contactDetails:[{
        contactPerson:{
            type:String,
            default:""
        },
        personsDesignation:{
            type:String,
            default:""
        },
        phone:{
            type:String,
            default:""
        },
        email:{
            type:String,
            default:""
        },

    }],
    companyAddress:[{
        addressLine1:{
            type:String,
            default:""
        },
        addressLine2:{
            type:String,
            default:""
        },
        country:{
            type:String,
            default:""
        },
        state:{
            type:String,
            default:""
        },
        city:{
            type:String,
            default:""
        },
        zipCode:{
            type:String,
            default:""
        }
    }],
    createdDate: {
        type: String,
        default:""
    },
    createdBy:{
        type: String,
        default:""
    },
    modifiedDate:{
        type:String,
        default:""
    },
    modifiedBy:{
        type:String,
        default:""
    }
});


const companyModel = mongoose.model('companyInfo', new mongoose.Schema({
    companyInfo: [companyInfoSchema],
    propertyId: {
        type: String,
        default: ""
    }
}));

export default companyModel;

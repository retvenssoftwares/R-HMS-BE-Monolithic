import mongoose from "mongoose";
import db1 from "../db/conn.js"
const companySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: "",
    },
    companyId: {
        type: String,
        default: "",
    },
    createdOn: {
        type: String,
        default: "",
    },
    createdBy: {
        type: String,
        default: "",
    },

    companyLogo: [{
        companyLogo: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],
    displayStatus: [{
        displayStatus: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],
    companyName: [{
        companyName: {
            type: String,
            default: "",
        },

        logId: {
            type: String,
            default: "",
        }
    }],
    accountType: [{
        accountType: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    companyEmail: [{
        companyEmail: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],
    companyWebsite: [{
        companyWebsite: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    shortCode: [{
        shortCode: {
            type: String,
            default: "",
        },
        logId: { type: String, default: "" }
    }
    ],
    registrationNumber: [{
        registrationNumber: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }

    }],

    taxId: [{
        taxId: {
            type: String,
            default: "",
        },

        logId: {
            type: String,
            default: "",
        }
    }],

    openingBalance: [
        {
            openingBalance: {
                type: String,
                default: "",
            },
            logId: {
                type: String,
                default: "",
            }
        }
    ],
    

    billingCycle: [{
        month: {
            type: String,
            default: ''
        },
        days: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    contactPerson: [{
        contactPerson: {
            type: String,
            default: "",
        },

        logId: {
            type: String,
            default: "",
        }
    }],

    phoneNumber: [{
        phoneNumber: {
            type: String,
            default: "",
        },

        logId: {
            type: String,
            default: "",
        }
    }],

    personDesignation: [{
        personDesignation: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    contractPdf: [{
        contractPdf: {
            type: String,
            default: "",
        },
        
        logId: {
            type: String,
            default: "",
        }
    }],

    personEmail: [{
        personEmail: {
            type: String,
            default: "",
        },
        
        logId: {
            type: String,
            default: "",
        }
    }],

    addressLine1: [{
        addressLine1: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    addressLine2: [{
        addressLine2: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],


    country: [{
        country: {
            type: String,
            default: "",
        },
    
        logId: {
            type: String,
            default: "",
        }
    }],

    state: [{
        state: {
            type: String,
            default: "",
        },
       
        logId: {
            type: String,
            default: "",
        }
    }],

    city: [{
        city: {
            type: String,
            default: "",
        },
       
        logId: {
            type: String,
            default: "",
        }
    }],


    zipCode: [{
        zipCode: {
            type: String,
            default: "",
        },
        
        logId: {
            type: String,
            default: "",
        }
    }],

    effectiveFrom: [{
        effectiveFrom: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],

    expiration: [{
        expiration: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],

    contractType: [{
        contractType: {
            type: String,
            default: "",
        },
     
        logId: {
            type: String,
            default: "",
        }
    }],

    creditLimit: [{
        creditLimit: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],


    contractTerms: [{
        contractTerms: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],
    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],
    modifiedBy: [{
        modifiedBy: {
            type: String,
            default: "",
        },
      
        logId: {
            type: String,
            default: "",
        }
    }],


})
const company = db1.model('company', companySchema);
export default company;
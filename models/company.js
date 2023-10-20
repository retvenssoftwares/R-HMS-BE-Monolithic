import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: "",
    },
    companyId: {
        type: String,
        default: "",
    },

    companyLogo: [{
        companyLogo: {
            type: String,
            default: "",
        },
        modifiedOn: {
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
        modifiedOn: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],
    companyType: [{
        companyType: {
            type: String,
            default: "",
        },
        modifiedOn: {
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
        }
    }
    ],
    registrationNumber: [{
        registrationNumber: {
            type: String,
            default: "",
        },
        modifiedOn: {
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
        modifiedOn: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    openingBalance: [{
        openingBalance: {
            type: String,
            default: "",
        },
        modifiedOn: {
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
        modifiedOn: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    billingPreference: [{
        billingPreference: {
            type: String,
            default: "",
        },
        modifiedOn: {
            type: String,
            default: "",
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],

    email: [{
        email: {
            type: String,
            default: "",
        },
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
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
        modifiedOn: {
            type: String,
            default: "",
        },
        logId: {
            type: String,
            default: "",
        }
    }],


})
const company = mongoose.model('company', companySchema);
export default company;
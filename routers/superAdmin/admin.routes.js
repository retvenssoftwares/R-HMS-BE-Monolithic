import express from 'express';
const router = express.Router();

//postingRule
import postingRules from "../../controllers/superAdmin/postPostingRules.js"
import postingRule from "../../controllers/superAdmin/getPostingRules.js"

//chargeRule
import chargeRules from "../../controllers/superAdmin/postChargeRules.js"
import chargeRule from "../../controllers/superAdmin/getChargeRules.js"

//bedType
import bedTypes from "../../controllers/superAdmin/postBedType.js"
import bedTypeRule from "../../controllers/superAdmin/getBedType.js"

//inclusionType
import inclusionTypes from "../../controllers/superAdmin/postInclusionType.js"
import inclusionTypesRule from "../../controllers/superAdmin/getInclusionType.js"

//accountType
import accountTypes from "../../controllers/superAdmin/postAccountType.js"
import accountTypesMethod from "../../controllers/superAdmin/getAccountType.js"

//PropertyRating
import postRating from '../../controllers/superAdmin/postPropertyRating.js'
import getRating from '../../controllers/superAdmin/getPropertyRating.js'

//PropertyType
import postPropertyType from '../../controllers/superAdmin/postPropertyType.js'
import getPropertyType from '../../controllers/superAdmin/getPropertyType.js'


////////////////////////////////////////////////////
//bedType
router.post("/api/bedType", bedTypes);
router.get("/api/getBedType", bedTypeRule);

//posting 
router.post("/api/postingRule", postingRules);
router.get("/api/postingRulesModels", postingRule);


//charge
router.post("/api/chargeRule", chargeRules );
router.get("/api/getchargeRule", chargeRule);

//inclusionType
router.post("/api/inclusionType", inclusionTypes);
router.get("/api/getInclusionType", inclusionTypesRule);

//accountType
router.post("/api/postAccountType", accountTypes);
router.get("/api/getAccountType", accountTypesMethod);

//propertyRating
router.post("/api/postRating",postRating)
router.get("/api/getRating",getRating)

//PropertyType
router.post("/api/postPropertyType",postPropertyType)
router.get("/api/getPropertyType",getPropertyType)

export default router;
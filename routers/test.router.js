import express from "express"
const router = express.Router()

import postTestData from "../controllers/test.js"

router.post("/done", postTestData)

export default router
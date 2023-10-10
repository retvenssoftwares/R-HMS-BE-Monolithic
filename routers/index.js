import express from 'express'
const app = express();
const router = express.Router();
import userRouter from './userRouter.js'
app.use(userRouter)
export default router
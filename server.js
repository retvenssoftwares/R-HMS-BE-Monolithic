
import express from 'express';
import "./db/conn.js"
import  userRouter from "./routers/userRouter.js"
const app = express();

app.use(express.json());
app.use('/users', userRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

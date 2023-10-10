import express from 'express';
import "./db/conn.js"
import  allRoutes from "./routers/userRouter.js"
const app = express();

app.use(express.json());

app.use(allRoutes)
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

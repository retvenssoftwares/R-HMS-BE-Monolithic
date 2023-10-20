import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import "./db/conn.js"
import propertyRoutes from "./routers/Property/property.routes.js"
import roomRoutes from "./routers/Rooms/room.routes.js"
import user from "./routers/User/user.router.js"
import rooms from "./routers/Rooms/ratePlanRouter.js"
import companyRoutes from "./routers/Rooms/company.routes.js"
const app = express();

app.use(express.json());

app.use(propertyRoutes)
app.use(rooms)
app.use(user)
app.use(roomRoutes)
app.use(companyRoutes)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import "./db/conn.js"
import "./db/conn2.js"
import propertyRoutes from "./routers/Property/property.routes.js"
import roomRoutes from "./routers/Rooms/room.routes.js"
import user from "./routers/User/user.router.js"
import rooms from "./routers/Rooms/ratePlanRouter.js"
import companyRoutes from "./routers/Rooms/company.routes.js"
import amenityRoutes from "./routers/Amenities/amenity.routes.js"
import superAdminRoutes from "./routers/superAdmin/admin.routes.js"
import testR from './routers/test.router.js'
const app = express();
app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods','POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  //allow request to continue and be handled by routes
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(testR)
app.use(propertyRoutes)
app.use(rooms)
app.use(user)
app.use(roomRoutes)
app.use(amenityRoutes)
app.use(companyRoutes)
app.use(superAdminRoutes)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

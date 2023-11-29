import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';

import cors from 'cors';
import http from 'http'; // Import the http module
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app); // Create an HTTP server using the Express app
const io = new Server(server);


//import "./helpers/deletOldBooking.js"
import "./db/conn.js"
import "./db/conn2.js"
import propertyRoutes from "./routers/Property/property.routes.js"
import roomRoutes from "./routers/Rooms/room.routes.js"
import user from "./routers/User/user.router.js"
import rooms from "./routers/Rooms/ratePlanRouter.js"
import companyRoutes from "./routers/Rooms/company.routes.js"
import amenityRoutes from "./routers/Amenities/amenity.routes.js"
import booking from "./routers/Booking/booking.js"
import superAdminRoutes from "./routers/superAdmin/admin.routes.js"
import testR from './routers/test.router.js'
import mmtRoutes from './routers/OTA/addMMT.router.js'
import bulkUpdateRoutes from './routers/InventoryAndRates/manageInventoryRates.routes.js'
import mmtBookingNotificationRoutes from './routers/OTA/Notifications/notification.routes.js'
import otaRoutes from './routers/OTA/ota.router.js'
import Dashboard   from './routers/dashboard/dashboard.js';
// import { oldBooking } from "./helpers/deletOldBooking.js";

app.use(cors({
  origin: '*'
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
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
app.use(mmtBookingNotificationRoutes)
app.use(companyRoutes)
app.use(booking)
app.use(bulkUpdateRoutes)
app.use(otaRoutes)
app.use(mmtRoutes)
app.use(superAdminRoutes)
app.use(Dashboard)


app.get("/", (req, res) => {
  return res.status(200).send("welcome to HMS backend services")
})

io.on("connection", (socket) => {
  console.log("A user connected");
  // Handle socket.io events
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export { io }


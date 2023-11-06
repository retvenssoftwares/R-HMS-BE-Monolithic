import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';

import cors from 'cors';
import http from 'http'; // Import the http module
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app); // Create an HTTP server using the Express app
const io = new Server(server);



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
import bulkUpdateRoutes from './routers/InventoryAndRates/manageInventoryRates.routes.js'


app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(testR)
app.use(propertyRoutes)
app.use(rooms)
app.use(user)
app.use(roomRoutes)
app.use(amenityRoutes)
app.use(companyRoutes)
app.use(booking)
app.use(bulkUpdateRoutes)
app.use(superAdminRoutes)


io.on("connection", (socket) => {
  console.log("A user connected");
  // Handle socket.io events
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export {io}


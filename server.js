
import express from 'express';
import "./db/conn.js"
import propertyRoutes from "./routers/Property/property.routes.js"
import roomRoutes from "./routers/Rooms/room.routes.js"
import user from "./routers/User/user.router.js"
const app = express();

app.use(express.json());

app.use(propertyRoutes)
app.use(user)
app.use(roomRoutes)
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

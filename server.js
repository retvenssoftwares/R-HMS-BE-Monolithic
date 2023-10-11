
import express from 'express';
import "./db/conn.js"
import propertyRoutes from "./routers/Property/property.routes.js"
const app = express();

app.use(express.json());

app.use(propertyRoutes)
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import "./db/conn.js";
import routes from './routers'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/', routes);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App is listening on: ", PORT);
});

export default server;

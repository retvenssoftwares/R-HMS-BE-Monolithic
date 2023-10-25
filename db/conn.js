import * as dotenv from 'dotenv';
dotenv.config();
import { createConnection } from "mongoose";
const db1 = createConnection(process.env.mongourl1, { useNewUrlParser: true, useUnifiedTopology: true })

if (db1) {
    console.log("DB1 connected")
} else {
    console.log("DB1 connection error")
}

export default db1

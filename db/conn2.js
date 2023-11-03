import * as dotenv from 'dotenv';
dotenv.config();
import { createConnection } from "mongoose";

const db2 = createConnection(process.env.mongourl2, { useNewUrlParser: true, useUnifiedTopology: true })

if (db2) {
    console.log("DB2 connected success")
} else {
    console.log("DB2 connection error")
}
export default db2
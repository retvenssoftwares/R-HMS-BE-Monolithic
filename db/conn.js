require('dotenv').config()

const mongoose = require("mongoose");

const url = process.env.mongourl
mongoose.connect(url,{
    //useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection is successful");
}).catch((e) => {
    console.log("No connection");
})
 
const express = require('express');
const app = express();
const mongoose = require('./db/conn');  
const router=require("./routes/router")
const cors=require("cors")
const cookiParser = require('cookie-parser')
const port = 7000;

// app.get('/', (req, res) => {
//     res.send("hello from api");
// });

app.use(express.json());
app.use(cookiParser())
app.use(cors())
app.use(router)

 


app.listen(port, () => {
    console.log("Server started on port", port);
});

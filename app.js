require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const PORT = process.env.PORT || 6004;

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("./uploads"));


app.get('/', (req, res) => {        
    res.send('GET request to homepage');      
});

const authenticate = require("./Routes/Authenticate");
app.use("/api/authenticate",authenticate);

const restaurant = require("./Routes/Restaurant");
app.use("/api/restaurant",restaurant);

const user = require("./Routes/Customer");
app.use("/api/user",user);

app.listen(PORT,()=>{
    console.log(`server start at PORT no ${PORT}`)
})
  
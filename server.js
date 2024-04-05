require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const MONGO_URL = process.env.MONGO_URL;

const app = express(); 

app.use(express.json());


app.use("/user", userRoute);
app.get('/', (req, res) => {
 return  res.status(200).send('Hello!!!!!!')
})

port = process.env.PORT || 6000;
(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Successfully connected to the database");

    app.listen(port, () => {
      console.log(`Listening for requests on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
})();

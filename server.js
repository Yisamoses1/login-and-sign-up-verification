require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use("/user", userRoute);
app.get('/', (req, res) => {
  res.send('Hello!!!!!!')
})

port = process.env.PORT;
app.listen(
  (port,
  () => {
    console.log(`Listening for request on port ${port}`);
  })
);

MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./router/product");
const Order = require("./router/order");
const Login = require("./router/loginuser");

mongoose
  .connect("mongodb://localhost:27017/inventorys")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", Product);
app.use("/orders", Order);
app.use("/login", Login);

const port = 4000;
app.listen(port, () => {
  console.log(`server listening the port ${port}`);
});

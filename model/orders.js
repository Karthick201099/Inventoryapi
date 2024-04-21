const mongoose = require("mongoose");
const { productschema } = require("./products");

const orderschema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
  },
  customer_address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  product: {
    type: productschema,
    required: true,
  },
});

const OrderModel = mongoose.model("order", orderschema);

module.exports.OrderModel = OrderModel;
module.exports.orderschema = orderschema;

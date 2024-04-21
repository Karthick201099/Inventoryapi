const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  brand_name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
const ProductModel = mongoose.model("product", productschema);

module.exports.ProductModel = ProductModel;
module.exports.productschema = productschema;

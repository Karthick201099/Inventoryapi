const express = require("express");

router = express.Router();

const Joi = require("joi");
const { OrderModel } = require("../model/orders");
const { ProductModel } = require("../model/products");

// get the data to datebase
const itemperpage = 10;
router.get("/", async (req, res) => {
  const pageno = req.query.page;
  const skip = (pageno - 1) * itemperpage;
  const geter = await OrderModel.find().limit(itemperpage).skip(skip);
  res.json(geter);
});

router.get("/total", async (req, res) => {
  const geter = await OrderModel.find().count();
  res.json(geter);
});

// find and get data

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await OrderModel.findById(id).select(
      "-_id -__v -date -product "
    );
    if (!user)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

// to request & response to the api and database

router.post("/", async (req, res) => {
  // handling the err for the joi

  const { error } = ValidationOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await ProductModel.findById(req.body.productid);
  // In case dosen't match to it will be handle the error

  if (!product) return res.status(400).send("invalid Product");
  // constructor function to create new

  const trainer = new OrderModel({
    customer_name: req.body.customer_name,
    customer_email: req.body.customer_email,
    customer_mobile: req.body.customer_mobile,
    customer_address: req.body.customer_address,
    date: req.body.date,
    product: {
      _id: product._id,
      product_name: product.product_name,
      color: product.color,
      price: product.price,
      stock: product.stock,
      code: product.code,
      brand_name: product.brand_name,
    },
  });
  const training = await trainer.save();
  console.log(training);
  res.send("Created Successfully");
});

router.put("/:id", async (req, res) => {
  // handling the err for the joi

  const { error } = ValidationOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await ProductModel.findById(req.body.productid);
  // In case dosen't match to it will be handle the error

  if (!product) return res.status(400).send("invalid course");

  const orderput = await OrderModel.findByIdAndUpdate(
    req.params.id,
    {
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_mobile: req.body.customer_mobile,
      customer_address: req.body.customer_address,
      date: req.body.date,
      product: {
        _id: product._id,
        product_name: product.product_name,
        color: product.color,
        price: product.price,
        stock: product.stock,
        code: product.code,
        brand_name: product.brand_name,
      },
    },
    { new: true }
  );
  // In case dosen't match to it will be handle the error

  if (!orderput)
    return res.status(404).send("The trainer with the given ID was not found.");
  res.send("Updated Successfully");
});
// delete the data

router.delete("/:id", async (req, res) => {
  const orderdelete = await TrainerModel.findByIdAndDelete(req.params.id);
  // In case dosen't match to it will be handle the error

  if (!orderdelete)
    return res.status(404).send("The trainer with the given ID was not found.");
  res.send(" Deleted successfully!");
});

function ValidationOrder(orders) {
  const Schema = Joi.object({
    customer_name: Joi.string().required(),
    customer_email: Joi.string().required(),
    customer_mobile: Joi.string().required(),
    customer_address: Joi.string().required(),
    productid: Joi.string().required(),
  });
  result = Schema.validate(orders);
  return result;
}
module.exports = router;

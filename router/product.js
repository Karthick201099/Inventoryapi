const express = require("express");
const { ProductModel } = require("../model/products");
const Joi = require("joi");

router = express.Router();

// get the data
const itemperpage = 10;
router.get("/", async (req, res) => {
  const pageno = req.query.page;
  const skip = (pageno - 1) * itemperpage;
  const geter = await ProductModel.find().limit(itemperpage).skip(skip);
  res.json(geter);
});

// get the single data

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await ProductModel.findById(id).select("-_id -__v -date ");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});
// get the count
router.get("/total", async (req, res) => {
  const geter = await ProductModel.find().count();
  res.json(geter);
});

// send to the data to db

router.post("/", async (req, res) => {
  const { error } = ValidationProuct(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const products = new ProductModel(req.body);
  productss = await products.save();
  console.log(productss);
  res.send("Created Successfully");
});

// update the data

router.put("/:id", async (req, res) => {
  const { error } = ValidationProuct(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const id = req.params.id;

  const productput = await ProductModel.findByIdAndUpdate(
    id,
    {
      product_name: req.body.product_name,
      color: req.body.color,
      price: req.body.price,
      stock: req.body.stock,
      code: req.body.code,
      brand_name: req.body.brand_name,
    },
    { new: true }
  );
  console.log(productput);

  // In case dosen't match to it will be handle the error
  if (!productput)
    return res.status(404).send("The course with the given ID was not found.");
  res.send("Updated Successfully");
});

// delete the data

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const productdelete = await ProductModel.findByIdAndDelete(id);
    console.log(productdelete);
    if (!productdelete)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(" Deleted successfully!");
  } catch (err) {
    console.log(err.message);
  }
});

function ValidationProuct(products) {
  const Schema = Joi.object({
    product_name: Joi.string().required(),
    price: Joi.string().required(),
    color: Joi.string().required(),
    stock: Joi.string().required(),
    code: Joi.string().required(),
    brand_name: Joi.string().required(),
  });
  result = Schema.validate(products);
  return result;
}

module.exports = router;

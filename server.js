const { error } = require("console");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/productModel");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes

app.get("/", (req, res) => {
  res.send("Hello Node api");
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findByIdAndUpdate(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save Products information
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// Update Products Data
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Connect to Mongo
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log("node API app is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

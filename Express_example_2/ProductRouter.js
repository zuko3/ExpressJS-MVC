const express = require("express");
const productController = require("./ProductController");
const router = express.Router();

router.get("/",productController.getProducts)

module.exports = router;
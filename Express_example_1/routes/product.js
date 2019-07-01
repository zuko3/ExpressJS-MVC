const expres = require('express');
const router = expres.Router();
const productController = require("../controllers/product");

router.get("/add",productController.getAddProduct);
router.post("/add",productController.postAddProducts);

router.get("/all",productController.getAllProducts);
router.get("/delete/:id",productController.deleteProducts);
router.get("/:id",productController.getEdit);
router.post("/edit",productController.editProduct);


module.exports = router;
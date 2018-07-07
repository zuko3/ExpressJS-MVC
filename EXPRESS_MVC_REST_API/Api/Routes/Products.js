const express=require("express");
const router=express.Router();
const checkAuthentication=require("../AuthMiddleWare/AuthenticationMiddleWare");
const productController=require("../Controller/Products");

router.get("/",productController.getAllProducts);
router.post("/",checkAuthentication,productController.addProducts);
router.get("/:productId",productController.getParticularProduct);
router.patch("/:productId",checkAuthentication,productController.updateProduct);
router.delete("/:productId",checkAuthentication,productController.deleteProduct);

module.exports=router;
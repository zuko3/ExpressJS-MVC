const express=require("express");
const router=express.Router();
const checkAuthentication=require("../AuthMiddleWare/AuthenticationMiddleWare");
const orderController=require("../Controller/Orders");

router.get("/",orderController.getAllOrders);
router.post("/",checkAuthentication,orderController.addOrder);
router.get("/:orderId",orderController.getparticularOrder);
router.patch("/:orderId",checkAuthentication,orderController.updateOrders);
router.delete("/:orderId",checkAuthentication,orderController.deleteOrder);

module.exports=router;
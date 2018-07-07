const express=require("express");
const router=express.Router();
const UserController=require("../Controller/Users");

router.post("/signup",UserController.doSignUp);
router.delete("/:userId",UserController.deleteUser);
router.post("/login",UserController.doLogin)


module.exports=router;
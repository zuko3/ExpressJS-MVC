const user=require("../Models/Users");
const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const JWT_KEY="secrete";


exports.doSignUp=(req,res,next)=>{
    user.find({
        email:req.body.email
    }).exec()
    .then((userres)=>{
        if(userres.length > 0){
            return res.status(422).json({
                message:"user exists"
            });
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
        
                }else{
                    const userobj=new user({
                        _id:new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    });
                    
                    userobj.save()
                    .then((result)=>{
                        res.status(201).json({
                            message:"User created"
                        })
                    })
                    .catch((error)=>{
                        res.status(500).json({
                            error:error
                        })
                    })
                    
                }
            })
        }
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}



exports.deleteUser=(req,res,next)=>{
    const userId=req.params.userId;
    res.status(200).json({
        message:"User deletion route",
        userid:userId
    })
}



exports.doLogin=(req,res,next)=>{
    user.find({email:req.body.email})
    .exec()
    .then((reslutuser)=>{
        if(reslutuser.length==0){
            return res.status(401).json({
                message:"Unauthorized user"
            })
        }
        bcrypt.compare(req.body.password,reslutuser[0].password,(err,success)=>{
            if(err){
                return res.status(401).json({
                    message:"Unauthorized user"
                })
            }
            if(success){
                //running token code synchronusly avoiding callback
                const token=jwt.sign({
                    email:reslutuser[0].email,
                    userId:reslutuser[0]._id
                },JWT_KEY,{expiresIn:"1h"});

                res.status(200).json({
                    message:"Authentication Successfull",
                    token
                });
            }else{
                 res.status(401).json({
                    message:"Unauthorized user"
                })
            }
        })
    })
    .catch((error)=>{
        res.status(500).json(error)
    })

}
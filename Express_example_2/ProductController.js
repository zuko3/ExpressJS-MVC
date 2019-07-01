const Product = require("./ProductModel");

exports.getProducts=function(req,res,next){
    Product.fetchProducts().then(function(content){
        return res.render("index",{
            products:content,
            title:'All products'
        })
    }).catch(function(err){
        console.log(err);
    })
}
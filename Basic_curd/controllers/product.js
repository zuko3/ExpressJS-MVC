const ProductsClass = require("../models/Products");

exports.getAddProduct = function (req, res, next) {
    return res.render("products/add");
}

exports.postAddProducts = function (req, res, next) {
    const { name, url, price } = req.body;
    const Products = new ProductsClass(name, price, url)
    Products.save()
        .then(function () {
            return res.redirect("/product/all");
        })
        .catch(function (err) {
            console.log("Error:", err);
        })
}

exports.getAllProducts = function (req, res, next) {
    ProductsClass.all().then(function (products) {
        return res.render("products/all", { products });
    }).catch(function (err) {
        console.log(err);
    })
}

exports.deleteProducts = function (req, res, next) {
    const { id } = req.params;
    ProductsClass.delete(id).then(function () {
        return res.redirect("/product/all");
    }).catch(function (err) {
        console.log(err);
    })
}

exports.getEdit = function (req, res, next) {
    const { id } = req.params;
    ProductsClass.get(id).then(function (product) {
        return res.render("products/edit", { product });
    }).catch(function (err) {
        console.log("error", err)
    })
}

exports.editProduct = function (req,res,next){
    const {id,name,price,url} = req.body;
    ProductsClass.edit(id,new ProductsClass(name,price,url)).then(function(){
        return res.redirect("/product/all");
    }).catch(function(err){
        console.log("Error:",err)
    })

}
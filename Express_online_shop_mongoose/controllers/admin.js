const Products = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.addProducts = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Products({
        title, imageUrl, description, price
    });
    product.save()
        .then(() => res.redirect('/'))
        .catch(err => console.log("[ Error in inserting in addProducts ]:", err))
}

exports.getProducts = (req, res, next) => {
    Products.find()
        .then(products => res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        }))
        .catch(err => console.log("[ Error in getProducts ]:", err))
}

exports.getEditProduct = (req, res, next) => {
    const editMode = (req.query.edit === 'true');
    if (!editMode) {
        return res.redirect("/")
    }
    const { productId } = req.params;
    Products.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect("/");
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch(err => console.log("[ Error in getEditProduct ]:", err))
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;
    Products.findById(productId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save()
        })
        .then(() => res.redirect("/admin/products"))
        .catch(err => console.log("[Error in postEditProduct]:", err))
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Products.findByIdAndRemove(productId)
    .then(() => res.redirect("/admin/products"))
    .catch(err=>console.log("[Catch inside postDeleteProduct ]:",err))
} 
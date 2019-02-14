const Products = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: req.flash('error')
    });
}

exports.addProducts = (req, res, next) => {
    const { title, price, description } = req.body;
    const image = req.file;
    if (!image) {
        req.flash('error', 'uplaod is not and image');
        return res.redirect('/admin/add-product')
    }
    const imageUrl = image.path;
    const product = new Products({
        title, imageUrl, description, price
    });
    product.save()
        .then(() => res.redirect('/'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    Products.find()
        .then(products => res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        }))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: req.flash('error')
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, description } = req.body;
    const image = req.file;
    Products.findById(productId)
        .then(product => {
            product.title = title;
            if (image) {
                product.imageUrl = image.path;
            }
            product.price = price;
            product.description = description;
            return product.save()
        })
        .then(() => res.redirect("/admin/products"))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Products.findByIdAndRemove(productId)
        .then(() => res.redirect("/admin/products"))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
} 
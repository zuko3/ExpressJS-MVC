const Products = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.addProducts = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const Product = new Products(title, imageUrl, description, price);
    Product.save(Product);
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = (req.query.edit === 'true');
    if (!editMode) {
        return res.redirect("/")
    }
    const { productId } = req.params;
    Products.getProductById(productId, product => {
        if (!product) {
            return res.redirect("/");
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;
    const Product = new Products(title, imageUrl, description, price);
    Product['id'] = productId;
    Products.edit(productId, Product,
        () => res.redirect("/admin/products")
    )
}

exports.getProducts = (req, res, next) => {
    Products.getAll(
        products => res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    );
}
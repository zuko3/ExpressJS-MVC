const Products = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
}

exports.addProducts = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const Product = new Products(title,imageUrl,description,price);
    Product.save(Product);
    res.redirect('/');
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
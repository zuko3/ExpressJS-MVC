const Products = require('../models/products');

exports.getProducts = (req, res, next) => {
    Products.getAll(
        products => res.render('shop/product-list', 
        { prods: products, pageTitle: 'All Products', path: '/products' })
    );
}

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Products.getProductById(productId,
        (product) => res.render('shop/product-detail', {
            product: product, pageTitle: product.title, path: '/products'
        })
    )
}

exports.getIndex = (req, res, next) => {
    Products.getAll(
        products => res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })
    );
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart' })
}

exports.postCart = (req, res, next) =>{
    const { productId } = req.body;
    console.log(productId);
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders' })
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
}

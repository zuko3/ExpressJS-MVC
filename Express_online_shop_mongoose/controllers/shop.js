const Products = require('../models/products');
const Orders = require('../models/order');

exports.getIndex = (req, res, next) => {
    Products.find()
        .then(products =>
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            })
        ).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    Products.find()
        .then(products =>
            res.render('shop/product-list',
                { prods: products, pageTitle: 'All Products', path: '/products', isAuthenticated: req.session.isLoggedIn })
        ).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Products.findById(productId)
        .then(
            product => res.render('shop/product-detail', {
                product: product, pageTitle: product.title, path: '/products', isAuthenticated: req.session.isLoggedIn
            })
        ).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            return res.render('shop/cart', {
                cartProducts: products,
                path: '/cart',
                pageTitle: 'Your Cart',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Products.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(result => res.redirect("/cart"))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postCartDelete = (req, res, next) => {
    const { productId } = req.body;
    req.user.deleteItemFromCart(productId)
        .then(() => res.redirect("/cart"))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}


exports.getOrders = (req, res, next) => {
    Orders.find({ "user.userId": req.user._id })
        .then(orders => res.render('shop/orders', {
            orders: orders,
            path: '/orders',
            pageTitle: 'Your Orders',
            isAuthenticated: req.session.isLoggedIn
        }))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postOrders = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    //For geting the full product Details as we expand in populate
                    product: { ...i.productId._doc }
                }
            });
            const order = new Orders({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save()
        }).then(result => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout', isAuthenticated: req.session.isLoggedIn })
}

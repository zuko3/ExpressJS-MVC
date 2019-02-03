const Products = require('../models/products');

exports.getIndex = (req, res, next) => {
    Products.find()
        .then(products =>
            res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })
        ).catch(err => console.log("[ Error in getIndex ]:", err))
}

exports.getProducts = (req, res, next) => {
    Products.find()
        .then(products =>
            res.render('shop/product-list',
                { prods: products, pageTitle: 'All Products', path: '/products' })
        ).catch(err => console.log("[ Error in getProducts ]:", err))
}

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Products.findById(productId)
        .then(
            product => res.render('shop/product-detail', {
                product: product, pageTitle: product.title, path: '/products'
            })
        ).catch(err => console.log("[ Error in for singleProduct getProduct ]:", err))
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            return res.render('shop/cart', {
                cartProducts: products,
                path: '/cart',
                pageTitle: 'Your Cart'
            })
        })
        .catch(err => console.log("[Error in getCart controller]", err))
}

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Products.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(result => res.redirect("/cart"));
}

// exports.postCartDelete = (req, res, next) => {
//     const { productId, price } = req.body;
//     req.user.deleteItemFromCart(productId)
//         .then(() => res.redirect("/cart"))
//         .catch(err => console.log("[Error in postCartDelete]", err))
// }



// exports.getOrders = (req, res, next) => {
//     req.user.getOrders()
//         .then(orders => res.render('shop/orders', {
//             orders: orders,
//             path: '/orders',
//             pageTitle: 'Your Orders'
//         }))
//         .catch(err => console.log("[Errorr in getOrders]:", err))
// }

// exports.postOrders = (req, res, next) => {
//     req.user.addOrder()
//         .then(result => res.redirect('/orders'))
//         .catch(err => console.log("[Error in postOrder Controller]:", err))
// }


// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
// }

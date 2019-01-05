const Products = require('../models/products');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Products.fetchAll()
        .then(products =>
            res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })
        ).catch(err => console.log("[ Error in getIndex ]:", err))
}

exports.getProducts = (req, res, next) => {
    Products.fetchAll()
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

// exports.getCart = (req, res, next) => {
//     Cart.getCart(cart => {
//         Products.getAll(products => {
//             let cartProducts = [];
//             cart['products'].forEach(cproduct => {
//                 const cartItem = products.find(product => cproduct.id === product.id)
//                 if (cartItem) {
//                     cartProducts.push({
//                         cartproduct: cartItem,
//                         qty: cproduct.qty
//                     })
//                 }
//             });
//             res.render('shop/cart', {
//                 cartProducts: cartProducts,
//                 total: cart['totalPrice'],
//                 path: '/cart',
//                 pageTitle: 'Your Cart'
//             });
//         })
//     })
// }

// exports.postCartDelete = (req, res, next) => {
//     const { productId, price } = req.body;
//     Cart.deleteProduct(productId, price, () => {
//         res.redirect("cart")
//     })
// }

// exports.postCart = (req, res, next) => {
//     const { productId } = req.body;
//     Products.getProductById(
//         productId,
//         product => Cart.addProducts(productId, product.price)
//     );
//     res.redirect("/cart");
// }

// exports.getOrders = (req, res, next) => {
//     res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders' })
// }


// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
// }

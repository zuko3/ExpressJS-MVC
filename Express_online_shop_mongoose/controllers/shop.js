const fs = require('fs');
const path = require('path');
const Products = require('../models/products');
const Orders = require('../models/order');
const pdfkit = require('pdfkit');
const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    let totalItems = 0;
    const page = +req.query.page || 1;
    Products.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Products.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products =>
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
                hasPreviousPage: page > 1,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                currentPage: page,
                totalpage:parseInt(totalItems/ITEMS_PER_PAGE)
            })
        ).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    let totalItems = 0;
    const page = +req.query.page || 1;
    Products.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Products.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        }).then(products =>
            res.render('shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All Products',
                    path: '/products',
                    isAuthenticated: req.session.isLoggedIn,
                    hasPreviousPage: page > 1,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    currentPage: page,
                    totalpage:parseInt(totalItems/ITEMS_PER_PAGE)
                })
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    Orders.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error("No order found"))
            }
            else if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Un authorized"))
            } else {
                /**
                 * For sending file at a time
                 *  */
                // fs.readFile(invoicePath, (err, data) => {
                //     if (err) {
                //         return next(err)
                //     }
                //     //For setting the content type of file.
                //     res.setHeader('Content-Type', 'application/pdf');
                //     //For setting the filename while download.
                //     res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
                //     res.send(data);
                // });

                const pdfDoc = new pdfkit();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                pdfDoc.pipe(fs.createWriteStream(invoicePath));
                pdfDoc.pipe(res);
                pdfDoc.fontSize(26).text('Invoice', {
                    underline: true
                })
                let total = 0;
                order.products.forEach(prod => {
                    total = total + (prod.quantity * prod.product.price);
                    pdfDoc.fontSize(14).text(prod.product.title + " - " + prod.quantity + ' x $' + prod.product.price)
                })
                pdfDoc.fontSize(14).text('Total price : $' + total)
                pdfDoc.end();

                /**
                 * For streaming file.
                 */
                // const file = fs.createReadStream(invoicePath);
                // res.setHeader('Content-Type', 'application/pdf');
                // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                // file.pipe(res);
            }
        })
        .catch(err => next(err))
}

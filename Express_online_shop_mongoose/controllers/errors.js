exports.get404Page = (req, res, next) => {
    res.status(404).render('404', { 
        pageTitle: 'Page Not Found',
         path: '',
         isAuthenticated: req.session.isLoggedIn 
    });
}

exports.get500Page = (req, res, next) => {
    res.status(404).render('500', { 
        pageTitle: 'Internal server error',
         path: '',
         isAuthenticated: req.session.isLoggedIn 
    });
}
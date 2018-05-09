/*Home controllers*/

/* This function is used to handle index page */
exports.Index = function(request, response){
	var contextData={
		'titleforpage' : 'Express Home'
	}
    response.render('index',contextData);
};

/* this function is used to handle Aboutus page */ 
exports.Aboutus = function(request, response){
	var contextData={
		'titleforpage' : 'Express AboutUs'
	}
    response.render('about',contextData);
};

/* This function is used to handle contact page */
exports.contact = function(request, response){
	var contextData={
		'titleforpage' : 'Express Contact'
	}
    response.render('contact',contextData);
};

/* This function is used to handle service page */
exports.service = function(request, response){
	var contextData={
		'titleforpage' : 'Express Service'
	}
    response.render('service',contextData);
};

/* this function is used to handle the contact data page */
exports.saveContactData=function(request, response){
	var contextData={
		'titleforpage' : 'Express Contact',
		'data':request.body
	}
    response.render('contact',contextData);
}


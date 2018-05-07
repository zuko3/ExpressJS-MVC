/*Home controllers*/

exports.Index = function(request, response){
	var contextData={
		'titleforpage' : 'Express Home'
	}
    response.render('index',contextData);
};
 
exports.Other = function(request, response){
	var contextData={
		'titleforpage' : 'Express Other'
	}
    response.render('other',contextData);
};

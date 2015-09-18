var account = {};
account.open_user = null;

account.open = function(username){
	//try to find
		//if found, open
		//if not, show error
}

account.getInfo = function(username, callback){
	request({
    	url: ("https://api.imgur.com/3/account/" + username),
		headers: {
			"Authorization": authorization
		}
	}, callback);
}

account.userExists = function(username, callback){
	account.getInfo(username, function(err, res, body){
		var json = JSON.parse(body);
		if(json.success === true){
			callback({
				exists: true,
				info: json.data
			});
		}
		else{
			callback({
				exists: false,
				info: null
			});
		}
	});
}
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

account.set = function(username){
	//this basically just populates #info-panel-2
	//already -> name
	//account-base -> created, reputation, bio

	/*

	OCEALOT            | 12,000 rep
	|ocealot 		 | | created may 2, 2012
	|has not posted bio		 | | idolized (12,000 until blah)

	*/

	$("#info-panel-2").html("");
	account.getInfo = function(username, function(err, res, body){
		var user = JSON.parse(body).data;
		if(user.bio === null){
			user.bio = username + " does not have a bio";
		}
		var html = "<div>" + "<h6>" + username + "</h6>" + "<pre>" + user.bio + "</pre></div><div>" + 
	});
}

account.notoriety = [
	{
		max: -1,
		name: "Forever Alone"
	},
	{
		min: 0,
		max: 399,
		name: "Neutral"
	},
	{
		min: 400,
		max: 999,
		name: "Accepted"
	},
	{
		min: 1000,
		max: 1999,
		name: "Liked"
	},
	{
		min: 2000,
		max: 3999,
		name: "Trusted"
	},
	{
		min: 4000,
		max: 7999,
		name: "Idolized"
	},
	{
		min: 8000,
		max: 19999,
		name: "Renowned"
	},
	{
		min: 20000,
		max: 29999
		name: "Glorious"
	},
	{
		min: 30000,
		max: 39999,
		name: "Copper"
	},
	{
		min: 40000,
		max: 49999,
		name: "Bronze"
	},
	{
		min: 50000,
		max: 59999,
		name: "Silver"
	},
	{
		min: 60000,
		max: 69999,
		name: "Gold"
	},
	{
		min: 70000,
		max: 79999,
		name: "Platinum"
	},
	{
		min: 80000,
		name: "Imgurian"
	}
];
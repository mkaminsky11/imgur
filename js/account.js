var account = {};
account.gallery_only = true;

account.open = function(username){
	gallery.mode = "user";
	general.setPanel("user");
	gallery.user.name = username;
	gallery.page = 0;
	gallery.range = {start:0, end:0};
	$("#return").css("display","block");
	account.set(username);
}

account.getInfo = function(username, callback){
	request({
    	url: ("https://api.imgur.com/3/account/" + username),
		headers: {
			"Authorization": authorization
		}
	}, callback);
}

account.getGalleryInfo = function(username, callback){
	request({
    	url: ("https://api.imgur.com/3/account/" + username + "/gallery_profile"),
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
	gallery.getGallery(0, gallery.setGallery);
	$("#user-panel-2").html("");
	account.getInfo(username, function(err, res, body){
		$("#user-panel-2").html("");
		var user = JSON.parse(body).data;
		if(user.bio === null){
			user.bio = "";
		}
		else{
			user.bio = "<pre>" + user.bio + "</pre>"
		}


		var repInfo = account.getRepInfo(user.reputation);
		var curr_rep = repInfo.left;
		if(curr_rep === ""){
			curr_rep = repInfo.right;
		}
		var created = general.dateFromEpoch(user.created);
		//user.created
		var html = "<div class=\"top\"><h6>" + username + "</h6></div><div class=\"bottom\">";
		html += "<h5>" + "<span class=\"green\">" + general.intWithCommas(user.reputation) + "</span> reputation</h5>";
		html += user.bio;
		html += "<h5>Notoriety: <span>" + curr_rep + "</span></h5>";
		if(repInfo.to_go !== null){
			html += "<div class=\"progress-bar\" style=\"margin-bottom:10px\"><div><div style=\"width:"+repInfo.per+"%\"></div></div></div>";
			html += "<h4>" + general.intWithCommas(repInfo.to_go) + " left until <span>" + repInfo.right + "</span><h4>";
		}
		html += "<hr/><h4>created <span>" + created + "</span></h4></div>";
		$("#user-panel-2").append(html);

		account.getGalleryInfo(username, function(err, res, body){
			var info = JSON.parse(body).data;
			var html = "<h4>" + general.intWithCommas(info.total_gallery_submissions) + " gallery posts</h4>";
			html += "<h4>" + general.intWithCommas(info.total_gallery_comments) + " gallery comments</h4>";
			html += "<h4>" + general.intWithCommas(info.total_gallery_favorites) + " gallery favorites</h4>";
			$("#user-panel-2 .bottom").append(html);
		});
	});
}

account.getRepInfo = function(rep){
	var curr = "";
	var left = "";
	var right = "";
	var per = 0;
	var to_go = null;
	if(rep <= account.notoriety[0].max){
		per = 100;
		curr = account.notoriety[0].name;
		right = curr;
	}
	else if(rep >= account.notoriety[account.notoriety.length - 1].min){
		per = 100;
		curr = account.notoriety[account.notoriety.length - 1].name;
		left = curr;
	}
	else{
		for(var i = 1; i < (account.notoriety.length - 1); i++){
			if(rep >= account.notoriety[i].min && rep <= account.notoriety[i].max){
				curr = account.notoriety[i].name;
				left = curr;
				right = account.notoriety[i+1].name;
				to_go = rep - account.notoriety[i+1].min;
				per = (1 + to_go / (account.notoriety[i + 1].min - account.notoriety[i].min)) * 100;
				to_go *= -1;
			}
		}
	}
	return {
		current: curr,
		left: left,
		right: right,
		per: per,
		to_go: to_go
	}
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
		max: 29999,
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
var general = {};
general.numPosts = function(array, range){
	//how many posts to add
	var start = range.start;
	var end = range.end;
	var ideal = 10;
	var amount_left = array.length - end;
	var num = ideal;
	if(amount_left < ideal){
		num = amount_left;
	}
	amount_left -= num;
	var end = false;
	if(amount_left === 0){
		end = true;
	}
	var start_index = range.end + 1;
	var end_index = range.end + num;
	if(start === 0){
		start_index -= 1;
		end_index -= 1;
	}
	var ret = {
		reached_end: end,
		range: {
			start: start_index,
			end: end_index
		},
		num: num
	}
	return ret;
}

general.getImageInfoWithState = function(id, state, callback){
	request({
    	url: "https://api.imgur.com/3/image/" + id,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, function(err, res, body){
  		callback(err, res, body, state);
  	});
}

general.getImageInfo = function(id, callback){
	request({
    	url: "https://api.imgur.com/3/image/" + id,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, callback);
}

general.getGalleryImageInfoWithState = function(id, state, callback){
	request({
    	url: "https://api.imgur.com/3/gallery/image/" + id,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, function(err, res, body){
  		callback(err, res, body, state);
  	});
}

general.getGalleryImageInfo = function(id, callback){
	request({
    	url: "https://api.imgur.com/3/gallery/image/" + id,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, callback);
}

general.times = [
	[60, "minutes"],
	[60*60, "hours"],
	[60*60*24, "days"],
	[60*60*24*365, "years"]
];

general.timeSince = function(epoch){
	var current = (new Date).getTime(); //millis
	var diff = current - (epoch * 1000); //millis
	diff = diff / 1000; //seconds

	var ret = Math.ceil(diff) + " seconds";
	for(var i = 0; i < general.times.length; i++){
		var secs = general.times[i][0];
		if((diff / secs) > 1){
			ret = Math.ceil(diff / secs) + " " + general.times[i][1];
		}
	}
	return ret;
}

general.hover = function(){
	if($(this).find("video").get(0).paused === true){
		$(this).find("video").get(0).play();
		$(this).find(".pause").css("display","none");
	}
}

general.unhover = function(){
	if($(this).find("video").get(0).paused === false){
		$(this).find("video").get(0).pause();
		$(this).find(".pause").css("display","block");
	}
}

$("#search").keyup(function(event){
    if(event.keyCode == 13){
        general.searchChange();
    }
});

general.searchChange = function(){
	if($("#search").val().trim() === ""){
		//no longer a search, go back to gallery
		//TODO!
		general.return();
	}
	else{
		if($("#search-select").val() === "all"){
			gallery.mode = "search";
			general.setPanel("search");
			//show go back to gallery
			$("#return").css("display","block");
			gallery.page = 0;
			gallery.range = {start:0, end: 0};
			gallery.getGallery(0, gallery.setGallery);
		}
		else if($("#search-select").val() === "user"){
			account.userExists($("#search").val().trim(), function(res){
				if(res.exists === true){
					gallery.mode = "user";
					general.setPanel("user");
					gallery.user.name = $("#search").val().trim();
					gallery.page = 0;
					gallery.range = {start:0, end:0};
					$("#return").css("display","block");
					account.set($("#search").val().trim())
				}
				else{
					error.showError("User not found!");
				}
			});
		}
	}
}



general.return = function(){
	if(mode === "single"){
		mode = "gallery";
		single.close();
		if(gallery.mode === "gallery"){
			$("#return").css("display","none");
		}
	}
	else{
		gallery.mode = "gallery";
		general.setPanel("gallery");
		gallery.page = 0;
		gallery.range = {start:0, end: 0};
		$("#return").css("display","none");
		gallery.getGallery(0, gallery.setGallery);
	}
}

general.setPanel = function(panel){
	$("#info-panel>div").css("display","none");
	$("#info-panel-2").css("display","none");
	$("#info-panel-2>div").css("display","none");
	if(panel === "random"){
	}
	else{
		$("#" + panel + "-panel").css("display","block");
	}

	if(panel === "user"){
		$("#info-panel-2").css("display","flex");
		$("#user-panel-2").css("display","flex");
	}
}


general.intWithCommas = function(integer){
	integer = integer + "";
	integer = integer.split("").reverse().join("");
	var ret = "";
	for(var i = 0; i < integer.length; i++){
		ret = integer[i] + ret;
		if((i + 1) < integer.length && (i + 1)%3 === 0){
			ret = "," + ret;
		}
	}
	return ret;
}

general.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

general.dateFromEpoch = function(epoch){
	var d = new Date(0);
	d.setUTCSeconds(epoch);
	return general.months[d.getMonth()] + " " + d.getDate() + "," + d.getFullYear();
}
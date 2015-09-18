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
	console.log(ret);
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

general.times = [
	[60, "minutes"],
	[60*60, "hours"],
	[60*60*24, "days"],
	[60*60*365, "years"]
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

general.toggleSearch = function(){
	if($("#search").css("display") === "none"){
		$("#search").css("width",0).css("display","block");
		$("#search").velocity({
			width: 150
		},{
			complete: function(){
				$("#search").focus();
			}
		});
	}
	else{
		$("#search").velocity({
			width: 0
		},{
			complete: function(){
				$("#search").css("display","none");
			}
		});
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
		gallery.mode = "search";
		general.setPanel("search");
		//show go back to gallery
		$("#return").css("display","block");
		gallery.page = 0;
		gallery.range = {start:0, end: 0};
		gallery.getGallery(0, gallery.setGallery);
	}
}

general.return = function(){
	gallery.mode = "gallery";
	general.setPanel("gallery");
	gallery.page = 0;
	gallery.range = {start:0, end: 0};
	$("#return").css("display","none");
	gallery.getGallery(0, gallery.setGallery);
	$("#search").val("");
}

general.setPanel = function(panel){
	$("#info-panel>div").css("display","none");
	$("#" + panel + "-panel").css("display","block");
}
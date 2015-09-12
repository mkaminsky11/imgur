var client_id = "0b4d9e43c145774";
var authorization = "Client-ID " + client_id;
var oauth_url = "https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=code";

var request = require('request');
var gui = require('nw.gui');
var code = null;

var mode = "gallery";

//Authorization: Bearer YOUR_ACCESS_TOKEN ... later




var auth = {};
auth.window = null;
auth.login = function(){
	if(auth.window !== null){
		auth.window.close(true);
	}

	auth.window = gui.Window.open(oauth_url, {
		toolbar: false,
		focus: true
	});

	auth.window.on('loaded', function() {
	  var url = auth.window.window.location.href;
	  if(url.indexOf("https://imgur.com/?code=") === 0){
	  	//got it!
	  	code = url.split("?code=")[1];
	  	auth.window.close(true);
	  	auth.window = null;
	  	console.log(code);
	  }
	});
}





var gallery = {};
gallery.type = "hot"; //hot|usersub
gallery.sort = "viral"; //viral|time
gallery.user_mode = false; //looking at a user
gallery.search_mode = false; //looking at a search
gallery.posts = []; //array of posts
gallery.page = 0;
gallery.range = {
	start: 0,
	end: 0
};
gallery.lastItem = null;

gallery.getGallery = function(page, callback){
	gallery.page = page;
	if(gallery.user_mode === false && gallery.search_mode === false){
    	request({
      		url: ("https://api.imgur.com/3/gallery/"+gallery.type+"/"+gallery.sort+"/0.json?page=" + page),
      		headers: {
        		"Authorization": authorization
      		}
    	}, callback);
  	}
  	else if(gallery.user_mode === false && gallery.search_mode === true){
    	//search mode!
    	//TODO
  	}
  	else{
    	//if user_mode, get from user submissions to gallery
    	//TODO
  	}
}

gallery.setGallery = function(err, res, body){
	var json = JSON.parse(body).data;
    if(!err){
    	gallery.posts = json;
    	if(gallery.page === 0){
    		//first page, nead to clear
    		$("#grid").html("");
    		gallery.range = {
    			start: 0,
    			end: 0
    		}
    		//otherwise, will simply add to this
    	}

    	gallery.showMore();
	}
	else{
		//something went wrong
	}
}

gallery.showMore = function(){
	var res = general.numPosts(gallery.posts, gallery.range);
	gallery.range = res.range;
    for(var i = res.range.start; i < res.range.end; i++){
    	var post = gallery.posts[i];
    	if(post.is_album){
    		gallery.addGalleryAlbum(post);
    	}
    	else{
    		gallery.addGalleryPost(post);
    	}
    }
    gallery.lastItem = [].slice.call(document.querySelectorAll('#grid .item')).reverse()[0];
}

gallery.addGalleryPost = function(post){
	var video = false;
	if(post.mp4){video=true}

	var html = "<div class=\"item\"><img src=\"" + post.link + "\"></div>";
	if(video==true){
		html = "<div class=\"item\"><video loop autoplay src=\""+ post.webm +"\"></video></div>";
	}
	$("#grid").append(html);
}

gallery.addGalleryAlbum = function(post){

}



var general = {};
general.numPosts = function(array, range){
	//how many posts to add
	var start = range.start;
	var end = range.end;
	var ideal = 10;
	var amount_left = array.length - start;
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

var album = {};
album.id = null;
album.page = 0;
album.posts = [];
album.getAlbum = function(albumId, page, callback){
	album.id = albumId;
	album.page = page;
	request({
    	url: "https://api.imgur.com/3/album/"+albumId+"/images/0.json?page=" + page,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, callback);
};

/******
INIT
*******/
gallery.getGallery(0, gallery.setGallery);
$("#main").scroll(function(){
	if(mode === "gallery"){
		if(gallery.lastItem !== null && $(gallery.lastItem).visible(true) === true){
			gallery.showMore();
		}
	}
});
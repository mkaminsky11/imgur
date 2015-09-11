var client_id = "0b4d9e43c145774";
var authorization = "Client-ID " + client_id;
var oauth_url = "https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=code";

var request = require('request');
var gui = require('nw.gui');
var code = null;

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
gallery.waypoint = null;
gallery.lastPostIndex = 0;

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
    		gallery.lastPostIndex = 0;
    		//otherwise, will simply add to this
    	}

    	gallery.lastPostIndex =  gallery.lastPostIndex + (general.numPosts(gallery.posts, gallery.lastPostIndex) - 1)
    	for(var i = 0; i < general.numPosts(gallery.posts, gallery.lastPostIndex); i++){
    		var post = gallery.posts[i];
    		if(post.is_album){
    			gallery.addGalleryAlbum(post);
    		}
    		else{
    			gallery.addGalleryPost(post);
    		}
    	}
    	gallery.rearm();
	}
	else{
		//something went wrong
	}
}

gallery.addGalleryPost = function(post){
	var html = "<div class=\"item\"><img src=\"" + post.link + "\"></div>";
	$("#grid").append(html);
}

gallery.addGalleryAlbum = function(post){

}

gallery.rearm = function(){
	if(gallery.waypoint !== null){gallery.waypoint.destroy()}
	gallery.waypoint = new Waypoint({
		element: [].slice.call(document.querySelectorAll('#grid .item')).reverse()[0],
		handler: function(direction) {
			//need to show some more
			console.log(direction);
			var more_posts = general.numPosts(gallery.posts, gallery.lastPostIndex);
			var first_index = gallery.lastPostIndex + 1;
			gallery.lastPostIndex =  gallery.lastPostIndex + (more_posts - 1);
			for(var i = first_index; i < (gallery.lastPostIndex + 1); i++){
				var post = gallery.posts[i];
				if(post.is_album){
					gallery.addGalleryAlbum(post);
				}
				else{
					gallery.addGalleryPost(post);
				}
			}
			gallery.rearm();
		}
	});
}



var general = {};
general.numPosts = function(array, lastIndex){
	//for now...
	var amount_left = (array.length - lastIndex) -1;
	if(10 > amount_left){
		return amount_left;
	}
	return 10;
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
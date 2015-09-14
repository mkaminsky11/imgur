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
    		gallery.addGalleryPost(post, true);
    	}
    	else{
    		gallery.addGalleryPost(post, false);
    	}
    }
    gallery.lastItem = [].slice.call(document.querySelectorAll('#grid .item')).reverse()[0];
}

gallery.addGalleryPost = function(post, is_album){


  //same for both
  var author = "<h6 class=\"info\">";
  if(post.account_url !== null){
    author += "<span class=\"user\">" + post.account_url + "</span>";
  }

  var time = "<i class=\"fa fa-clock-o\"></i>" + general.timeSince(post.datetime) + "</h6>";
  var buttons = "<div class=\"flex-center\" style=\"margin-top: 10px\">";
  buttons += "<span class=\"btn-circle\"><i class=\"fa fa-arrow-up\"></i></span>";
  buttons += "<span class=\"btn-circle\"><i class=\"fa fa-arrow-down\"></i></span>";
  buttons += "<span class=\"btn-circle\"><i class=\"fa fa-heart\"></i></span>";
  buttons += "<span class=\"btn-circle\" style=\"border: none\"><i class=\"fa fa-ellipsis-v\"></i></span>"
  buttons += "</div>"

  var data = "<div class=\"data\">" + author + time + buttons + "</div>";
  var title = "<h4 class=\"title\">" + post.title + "</h4><h6>" + post.points + " points</h6>";


  if(is_album === false){
    //just an image
    var video = false;
    if(post.mp4){video=true}
    var height = post.height * (240 / post.width); //proportions!
    var img = "<div class=\"img\" style=\"height:"+ height + "px\"><img src=\"" + post.link + "\"></div>";
    if(video==true){
      img = "<div class=\"img\" style=\"height:"+ height + "px\"><video loop autoplay src=\""+ post.webm +"\"></video></div>";
    }
    var html = "<div class=\"item\" data-id=\""+ post.id +"\">" + title + img + data + "</div>";
    $("#grid").append(html);
  }
  else{
    var img = "<div class=\"img\"><p class=\"loading\">Loading...</p></div>";
    var html = "<div class=\"item\" data-id=\""+ post.id +"\">" + title + img + data + "</div>";
    $("#grid").append(html);

    var cover_image = post.cover;
    general.getImageInfoWithState(cover_image, {album_id: post.id}, function(err, res, body, state){
      var post = JSON.parse(body).data; //image info
      var video = false;
      if(post.mp4){video=true}
      var height = post.height * (240 / post.width); //proportions!
      var img = "<div class=\"img\" style=\"height:"+ height + "px\"><img src=\"" + post.link + "\"></div>";
      if(video==true){
        img = "<div class=\"img\" style=\"height:"+ height + "px\"><video loop autoplay src=\""+ post.webm +"\"></video></div>";
      }

      var album_id = state.album_id;
      $(".item[data-id=\""+album_id+"\"] .img").replaceWith(img);
    });
  }
}
var gallery = {};
gallery.type = "hot"; //hot|usersub
gallery.sort = "viral"; //viral|time
gallery.mode = "gallery";
gallery.posts = []; //array of posts
gallery.page = 0;
gallery.range = {
	start: 0,
	end: 0
};
gallery.search = {
  window: "all", //if top: day|month|week|year|all, else remove and edit text
  sort: "viral" //time|viral|top
}
gallery.user = {
  name: null
}
gallery.lastItem = null;
gallery.type_sort = [
  {
    section: "hot",
    name: "Hottest",
    sort: [
      {
        sort: "viral",
        name: "Most Viral"
      },
      {
        sort: "top",
        name: "Rank"
      },
      {
        sort: "time",
        name: "Newest"
      }
    ]
  },
  {
    section: "top",
    name: "Top",
    sort: [
      {
        sort: "viral",
        name: "Most Viral"
      },
      {
        sort: "top",
        name: "Rank"
      },
      {
        sort: "time",
        name: "Newest"
      }
    ]
  },
  {
    section: "user",
    name: "User",
    sort: [
      {
        sort: "viral",
        name: "Most Viral"
      },
      {
        sort: "top",
        name: "Rank"
      },
      {
        sort: "time",
        name: "Newest"
      },
      {
        sort: "rising",
        name: "Rising"
      }
    ]
  }
];

gallery.getGallery = function(page, callback){
	if(gallery.mode === "gallery"){
    	request({
      		url: ("https://api.imgur.com/3/gallery/"+gallery.type+"/"+gallery.sort+"/"+page+".json"),
      		headers: {
        		"Authorization": authorization
      		}
    	}, callback);
  	}
  	else if(gallery.mode === "search"){
      var _window = "";
      if(gallery.search.sort === "top"){
        _window = gallery.search.window + "/";
      }
    	request({
        url: ("https://api.imgur.com/3/gallery/search/"+gallery.search.sort+"/"+_window+page+".json?q="+encodeURIComponent($("#search").val())),
        headers: {
          "Authorization": authorization
        }
      }, callback);
  	}
  	else if(gallery.mode === "user"){
    	if(account.gallery_only === true){
        request({
          url: ("https://api.imgur.com/3/account/" + gallery.user.name + "/submissions/" + page + ".json"),
          headers: {
            "Authorization": authorization
          }
        }, callback);
      }
      else{
        request({
          url: ("https://api.imgur.com/3/account/" + gallery.user.name + "/images/" + page + ".json"),
          headers: {
            "Authorization": authorization
          }
        }, callback);
      }
  	}
    else if(gallery.mode === "random"){
      request({
        url: ("https://api.imgur.com/3/gallery/random/random/" + page + ".json"),
        headers: {
          "Authorization": authorization
        }
      }, callback);
    }
}

gallery.setGallery = function(err, res, body){
	var json = JSON.parse(body).data;
    if(!err){
      gallery.posts = json;
    	$("#grid").html("");
      $("#main").scrollTop(0);
      if(gallery.page > 0){
        $("#grid").append("<div class=\"pagination flex-center\" onclick=\"gallery.prevPage()\"><span style=\"text-align:center\">Load Previous Posts...<br/><i class=\"fa fa-arrow-left\" style=\"margin-top:10px\"></i></span></div>");
      }
    	gallery.range = {
    		start: 0,
    		end: 0
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
  if(res.reached_end === true){
    //to test, try something like gallery.posts = gallery.posts.slice(0,50)
    gallery.lastItem = null;
    //if the next page even exists
    //TODO:
    gallery.nextPageExists(function(){
      $("#grid").append("<div class=\"pagination flex-center\" onclick=\"gallery.nextPage()\"><span style=\"text-align:center\">Load More Posts...<br/><i class=\"fa fa-arrow-right\" style=\"margin-top:10px\"></i></span></div>");
    });
  }
}

gallery.nextPage = function(){
  gallery.page = gallery.page + 1;
  gallery.range = {start: 0, end: 0};
  $("#grid").html("");
  $("#main").scrollTop(0);
  gallery.getGallery(gallery.page, gallery.setGallery);
}

gallery.nextPageExists = function(callback){
  gallery.getGallery(gallery.page + 1, function(err, res, body){
    var json = JSON.parse(body).data;
    if(!err){
      if(json.length > 0){
        callback();
      }
    }
    else{
      //something went wrong
    }
  });
}

gallery.prevPage = function(){
  gallery.page = gallery.page - 1;
  gallery.range = {start:0, end:0};
  $("#grid").html("");
  $("#main").scrollTop(0);
  if(gallery.page === 0){
    $("#grid .pagination").remove();
  }
  gallery.getGallery(gallery.page, gallery.setGallery);
}

gallery.addGalleryPost = function(post, is_album){
  //same for both
  var author = "<h6 class=\"info\">";
  if(post.account_url !== null){
    author += "<span class=\"user\" onclick=\"account.open('"+ post.account_url +"')\">" + post.account_url + "</span>";
  }

  var time = "<i class=\"fa fa-clock-o\"></i>" + general.timeSince(post.datetime) + "</h6>";
  var buttons = "<div class=\"flex-center\" style=\"margin-top: 5px\">";
  buttons += "<span class=\"btn-circle\"><i class=\"fa fa-comment\"></i></span>";
  buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-arrow-up\"></i></span>";
  buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-arrow-down\"></i></span>";
  buttons += "<span class=\"btn-circle\"><i class=\"fa fa-heart\"></i></span>";
  buttons += "</div>";
  var data = "<div class=\"data\">" + author + time + buttons + "</div>";
  var title = "<h4 class=\"title\" onclick=\"single.open('"+post.id+"')\">" + post.title + "</h4><h6>" + general.intWithCommas(post.points) + " points</h6>";
  var pause = "<div class=\"pause\"><i class=\"fa fa-play-circle-o\"></i></div>";
  if(is_album === false){
    //just an image
    var video = false;
    if(post.mp4){video=true}
    var height = post.height * (240 / post.width); //proportions!
    var img = "<div class=\"img\" style=\"height:"+ height + "px\"><img src=\"" + post.link + "\"></div>";
    var media_url = post.link;
    if(video == true){
      media_url = post.webm;
      img = "<div class=\"img\" style=\"height:"+ height + "px\">" + pause + "<video loop src=\""+ post.webm + "?t=" + new Date().getMilliseconds() +"\"></video></div>";
    }
    var html = "<div class=\"item\" data-id=\""+ post.id +"\" data-media-url=\"" + media_url  + "\" data-video=\"" + video + "\">" + title + img + data + "</div>";
    $("#grid").append(html);

    if(video === true){
      $("#grid .item[data-id=\""+post.id+"\"]").hover(general.hover, general.unhover);
    }
  }
  else{
    var img = "<div class=\"img\"><p class=\"loading\"><i class=\"fa fa-spin fa-spinner\"></i></p></div>";
    var html = "<div class=\"item\" data-id=\""+ post.id +"\">" + title + img + data + "</div>";
    $("#grid").append(html);

    var cover_image = post.cover;
    general.getImageInfoWithState(cover_image, {album_id: post.id}, function(err, res, body, state){
      var post = JSON.parse(body).data; //image info
      var video = false;
      if(post.mp4){video=true}
      var height = post.height * (240 / post.width); //proportions!
      var img = "<div class=\"img\" style=\"height:"+ height + "px\"><i class=\"album fa fa-clone\"></i><img src=\"" + post.link + "\"></div>";
      var media_url = post.link;
      if(video === true){
        media_url = post.webm;
        //img = "<div class=\"img\" style=\"height:"+ height + "px\"><img src=\"" + post.link.replace("h.gif",".gif") + "\"></div>";
        img = "<div class=\"img\" style=\"height:"+ height + "px\"><i class=\"album fa fa-clone\"></i>"+ pause +"<video loop src=\""+ post.webm + "?t=" + new Date().getMilliseconds() +"\"></video></div>";
      }

      var album_id = state.album_id;
      $("#grid .item[data-id=\""+album_id+"\"]").attr("data-video", video);
      $("#grid .item[data-id=\""+album_id+"\"]").attr("data-media-url", media_url);
      $("#grid .item[data-id=\""+album_id+"\"] .img").replaceWith(img);

      if(video === true){
        $("#grid .item[data-id=\""+album_id+"\"]").hover(general.hover, general.unhover);
      }
    });


  }
}

gallery.typeChange = function(){
  gallery.type = $("#type-select").val();
  for(var i = 0; i < gallery.type_sort.length; i++){
    if(gallery.type_sort[i].section === gallery.type){
      //now populate the other select
      var first_option = gallery.type_sort[i].sort[0].sort;
      var html = "";
      var sorts = gallery.type_sort[i].sort;
      for(var j = 0; j < sorts.length; j++){
        html += "<option value=\"" + sorts[j].sort + "\">" + sorts[j].name + "</option>"
      }
      $("#sort-select").html(html);
      $("#sort-select").val(first_option);
      gallery.sort = first_option;
      gallery.page = 0;
      gallery.range = {start:0, end: 0};
      gallery.getGallery(0, gallery.setGallery);
    }
  }
}

gallery.sortChange = function(){
  gallery.sort = $("#sort-select").val();
  gallery.page = 0;
  gallery.range = {start:0, end: 0};
  gallery.getGallery(0, gallery.setGallery);
}

gallery.searchSortChange = function(){
  gallery.search.sort = $("#search-sort-select").val();
  if(gallery.search.sort === "top"){
    $("#search-window-select").css("display","inline-block");
  }
  else{
    $("#search-window-select").css("display","none");
  }
  gallery.page = 0;
  gallery.range = {start:0, end: 0};
  gallery.getGallery(0, gallery.setGallery);
}

gallery.searchWindowChange = function(){
  gallery.search.window = $("#search-window-select").val();
  gallery.page = 0;
  gallery.range = {start:0, end: 0};
  gallery.getGallery(0, gallery.setGallery);
}

gallery.random = function(){
    gallery.mode = "random";
    general.setPanel("random");
    //show go back to gallery
    $("#return").css("display","block");
    gallery.page = 0;
    gallery.range = {start:0, end: 0};
    gallery.getGallery(0, gallery.setGallery);
}
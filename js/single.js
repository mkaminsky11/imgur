var single = {};
single.nav = {
	allowed: true,
	back: true,
	forward: true
};
single.id = null;
single.post = null;
single.num_shown = 0;

/*
links:
+ image (raw)
	- gif
	- mp4
	- webm
	- gifv
open in imgur
topics? (topic_id + topic)
size
download
embed
_____
comments
*/

single.open = function(id, album){
	single.id = id;
	mode = "single";
	general.setPanel("single");
	$("#return").css("display","block");
	$("#grid").css("display","none");
	$("#single").css("display","block");
	var buttons = "<div class=\"flex-center\" style=\"margin-top: 5px\">";
  	buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-comment\"></i></span>";
  	buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-arrow-up\"></i></span>";
  	buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-arrow-down\"></i></span>";
  	buttons += "<span class=\"btn-circle btn-circle-large\"><i class=\"fa fa-heart\"></i></span>";
  	buttons += "</div>";
	if(album === false){
		general.getGalleryImageInfo(id, function(err, res, body){
			var post = JSON.parse(body).data;
			single.post = post;
			var topbar = "<h6>" + post.title + "</h6><h5>";
			if(post.account_url){
				topbar += "by <span class=\"user\">" + post.account_url + "</span> ";
			}
			topbar += "<i class=\"fa fa-clock-o\" style=\"margin-right:5px\"></i>" + general.timeSince(post.datetime) + "</h5>";

			var html = "";
			if(post.description === null){
				post.description = "";
			}
			else{
				post.description = "<pre class=\"image-desc\">" + post.description.autoLink() + "</pre>";
			}
			var img = "<img src=\"" + post.link + "\">";
			if(post.mp4){
				img = "<video preload=\"auto\" autoplay=\"autoplay\" muted=\"muted\" loop=\"loop\" webkit-playsinline=\"\">";
	               img += "<source src=\"" + post.webm + "\" type=\"video/webm\">";
	               img += "<source src=\"" + post.mp4 + "\" type=\"video/mp4\">";
	           	img += "</video>";
			}
			html += "<div class=\"single\">"+img+post.description+"</div>";
			var sidebar = "";
			var per_up = 0;
			var per_down = 0;
			if(!(post.ups === 0 && post.downs === 0)){
				var per_up = post.ups / (post.ups + post.downs) * 100;
				var per_down = post.downs / (post.ups + post.downs) * 100;
			}
			sidebar += "<div class=\"bottom\">"+buttons+"<h5 class=\"points\"><span class=\"green\">" + general.intWithCommas(post.points) + "</span> points</h5>";
			sidebar += "<div class=\"progress-bar\" style=\"margin-bottom:5px;margin-top:5px\"><div><div style=\"width:"+per_up+"%;background-color:#12F3AA\"></div><div style=\"width:"+per_down+"%;background-color:#F44336\"></div></div></div>";
			sidebar += "<h4 style=\"text-align:center\"><span class=\"up\">" + general.intWithCommas(post.ups) + "</span> | <span class=\"down\">" + general.intWithCommas(post.downs) + "</span></h6>"
			
			sidebar += "<hr/><h4>" + general.intWithCommas(post.views) + " views</h4>";
			sidebar += "<h4>" + general.getSize(post.size) + "</h4>";
			sidebar += "<h4>" + general.getSize(post.bandwidth) + " of bandwidth</h4>";
			sidebar += "</div>";

			sidebar += "<div class=\"comments\">"
			sidebar += "</div>";
			$("#single-panel").html(topbar);
			$("#single").html(html);
			$("#single-panel-2").html(sidebar);
		});
	}
	else{
		general.getGalleryAlbumInfo(id, function(err, res, body){
			var post = JSON.parse(body).data;
			single.post = post;
			var topbar = "<h6>" + post.title + "</h6><h5>";
			if(post.account_url){
				topbar += "by <span class=\"user\">" + post.account_url + "</span> ";
			}
			topbar += "<i class=\"fa fa-clock-o\" style=\"margin-right:5px\"></i>" + general.timeSince(post.datetime) + "</h5>";
			
			var html = "";
			if(post.description === null){
				post.description = "";
			}
			else{
				post.description = "<div class=\"post-desc\"><pre>" + post.description.autoLink() + "</pre></div>";
			}
			var num_shown = post.images_count;
			if(num_shown > 10){
				num_shown = 10;
			}
			single.num_shown = num_shown;
			for(var i = 0; i < num_shown; i++){
				var image = post.images[i];
				if(image.title === null){
					image.title = "";
				}
				else{
					image.title = "<h6 class=\"image-title\">" + image.title + "</h6>";
				}

				if(image.description === null){
					image.description = "";
				}
				else{
					image.description = "<pre class=\"image-desc\">" + image.description.autoLink() + "</pre>";
				}
				var img = "<img src=\"" + image.link + "\">";
				if(image.mp4){
					img = "<video preload=\"auto\" autoplay=\"autoplay\" muted=\"muted\" loop=\"loop\" webkit-playsinline=\"\">";
	               	img += "<source src=\"" + image.webm + "\" type=\"video/webm\">";
	               	img += "<source src=\"" + image.mp4 + "\" type=\"video/mp4\">";
	           		img += "</video>";
				}
				html += "<div class=\"single\">"+image.title+img+image.description+"</div>";
			}
			if(num_shown < post.images_count){
				html += "<span id=\"append-here\" style=\"display:none\"></span><div class=\"load-more\"><h6>Load " + (post.images_count - num_shown) + " more images</h6></div>"
			}
			html += post.description;


			var sidebar = "";
			var per_up = 0;
			var per_down = 0;
			if(!(post.ups === 0 && post.downs === 0)){
				var per_up = post.ups / (post.ups + post.downs) * 100;
				var per_down = post.downs / (post.ups + post.downs) * 100;
			}
			sidebar += "<div class=\"bottom\">"+buttons+"<h5 class=\"points\"><span class=\"green\">" + general.intWithCommas(post.points) + "</span> points</h5>";
			sidebar += "<div class=\"progress-bar\" style=\"margin-bottom:5px;margin-top:5px\"><div><div style=\"width:"+per_up+"%;background-color:#12F3AA\"></div><div style=\"width:"+per_down+"%;background-color:#F44336\"></div></div></div>";
			sidebar += "<h4 style=\"text-align:center\"><span class=\"up\">" + general.intWithCommas(post.ups) + "</span> | <span class=\"down\">" + general.intWithCommas(post.downs) + "</span></h6>"
			
			sidebar += "<hr/><h4>" + general.intWithCommas(post.views) + " views</h4>";
			sidebar += "<h4>" + general.getSize(post.size) + "</h4>";
			sidebar += "<h4>" + general.getSize(post.bandwidth) + " of bandwidth</h4>";
			sidebar += "</div>";
			$("#single-panel").html(topbar);
			$("#single").html(html);
			$("#single").scrollTop(0);
			$("#single-panel-2").html(sidebar);
		});
	}
}

single.close = function(){
	$("#single").css("display","none");
	$("#grid").css("display","flex");
}
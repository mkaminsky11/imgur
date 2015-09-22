var single = {};
single.nav = {
	allowed: true,
	back: true,
	forward: true
};
single.id = null;

single.open = function(id){
	mode = "single";
	general.setPanel("single");
	$("#return").css("display","block");
	$("#grid").css("display","none");
	$("#single").css("display","flex");

	general.getGalleryImageInfo(id, function(err, res, body){
		var post = JSON.parse(body).data;
		var topbar = "<h6>" + post.title + "</h6><h5>";
		if(post.account_url){
			topbar += "by <span class=\"user\">" + post.account_url + "</span> ";
		}
		topbar += "<i class=\"fa fa-clock-o\" style=\"margin-right:5px\"></i>" + general.timeSince(post.datetime) + "</h5>";
		
		var html = "";
		if(post.is_album === false){
			if(post.description === null){
				post.description = "";
			}
			else{
				post.description = "<pre>" + post.description + "</pre>";
			}

			var img = "<img src=\"" + post.link + "\">";
			if(post.mp4){
				img = "<video preload=\"auto\" autoplay=\"autoplay\" muted=\"muted\" loop=\"loop\" webkit-playsinline=\"\">";
                img += "<source src=\"" + post.webm + "\" type=\"video/webm\">";
                img += "<source src=\"" + post.mp4 + "\" type=\"video/mp4\">";
            	img += "</video>";
			}
			html += "<div class=\"single\">"+img+post.description+"</div>";
		}
		else{
			//TODO:
		}


		var sidebar = "";
		var per_up = 0;
		var per_down = 0;
		if(!(post.ups === 0 && post.downs === 0)){
			var per_up = post.ups / (post.ups + post.downs) * 100;
			var per_down = post.downs / (post.ups + post.downs) * 100;
		}
		sidebar += "<div class=\"bottom\"><h5 class=\"points\"><span class=\"green\">" + general.intWithCommas(post.points) + "</span> points</h5>";
		sidebar += "<div class=\"progress-bar\" style=\"margin-bottom:5px;margin-top:5px\"><div><div style=\"width:"+per_up+"%;background-color:#12F3AA\"></div><div style=\"width:"+per_down+"%;background-color:#F44336\"></div></div></div>";
		sidebar += "<h4 style=\"text-align:center\"><span class=\"up\">" + general.intWithCommas(post.ups) + "</span> | <span class=\"down\">" + general.intWithCommas(post.downs) + "</span></h6>"
		sidebar += "</div>";
		$("#single-panel").html(topbar);
		$("#single").html(html);
		$("#single-panel-2").html(sidebar);
	});
}

single.close = function(){
	$("#single").css("display","none");
	$("#grid").css("display","flex");
}
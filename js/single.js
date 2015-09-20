var single = {};
single.nav = {
	allowed: true,
	back: true,
	forward: true
};
single.id = null;

single.open = function(id){
	mode = "single";
	$("#return").css("display","block");
	$("#grid").css("display","none");
	$("#info-panel").css("display","none");
	$("#info-panel").css("display","none");
	$("#single").css("display","flex");
	$("#single-info").html("");

	general.getGalleryImageInfo(id, function(err, res, body){
		var post = JSON.parse(body).data;
		var info = "<h6 class=\"title\">" + post.title + "</h6>";
		$("#single-info").html(info);
	});
}

single.close = function(){
	$("#grid").css("display","flex");
	$("#single").css("display","none");
	$("#info-panel").css("display","block");
	if(gallery.mode === "user"){
		$("#info-panel-2").css("display","flex");
	}
	$("#single-info").html("");
}
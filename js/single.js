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
	});
}

single.close = function(){
	$("#single").css("display","none");
	$("#grid").css("display","flex");
}
var single = {};
single.nav = {
	allowed: true,
	back: true,
	forward: true
};
single.id = null;

single.open = function(id){
	$("#return").css("display","block");
	$("#grid").css("display","none");
	$("#info-panel").css("display","none");
	$("#info-panel").css("display","none");
	$("#single").css("display","flex");
}

single.close = function(){
	$("#grid").css("display","flex");
	$("#single").css("display","none");
	$("#info-panel").css("display","block");
	if(gallery.mode === "user"){
		$("#info-panel-2").css("display","flex");
	}
}
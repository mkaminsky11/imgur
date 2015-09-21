/******
INIT
*******/
function checkVis(){
	if(mode === "gallery"){
		if(gallery.lastItem !== null && $(gallery.lastItem).visible(true) === true){
			gallery.showMore();
		}
		$("#grid .item").each(function(index){
			//if($(this).visible(true) === false && ($(this).find("img").css("display") !== "none" && $(this).find("video").css("display") !== "none")){
			if($(this).visible(true) === false && $(this).find("img").length){
				//$(this).find("img").css("display","none");
				//$(this).find("video").css("display","none");
				$(this).find("img").remove();
			}
			else if($(this).visible(true) === true && !$(this).find("img").length){
			//else if($(this).visible(true) === true && ($(this).find("img").css("display") === "none" || $(this).find("video").css("display") === "none")){
				//$(this).find("img").css("display","block");
				//$(this).find("video").css("display","block");
				$(this).find(".img").append("<img src=\"" + $(this).attr("data-media-url") + "\">")
			}
		});
	}
}

$(document).ready(function(){
	gallery.getGallery(0, function(err, res, body){
		gallery.setGallery(err, res, body);
		checkVis();
	});
	$("#grid").scroll(function(){
		checkVis();
	});
});
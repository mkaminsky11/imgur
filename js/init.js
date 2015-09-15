/******
INIT
*******/
gallery.getGallery(0, gallery.setGallery);
$("#main").scroll(function(){
	if(mode === "gallery"){
		if(gallery.lastItem !== null && $(gallery.lastItem).visible(true) === true){
			gallery.showMore();
		}

		$("#grid .item").each(function(index){
			if($(this).visible(true) === false && ($(this).find("img").css("display") !== "none" && $(this).find("video").css("display") !== "none")){
				//$(this).find("img").remove();
				//$(this).find("video").remove();
				$(this).find("img").css("display","none");
				$(this).find("video").css("display","none");
			}
			else if($(this).visible(true) === true && ($(this).find("img").css("display") === "none" || $(this).find("video").css("display") === "none")){
				/*if($(this).attr("data-video") === "true"){
					$(this).find(".img").append("<video loop src=\"" + $(this).attr("data-media-url") + "\"></video>");
				}
				else{
					$(this).find(".img").append("<img src=\"" + $(this).attr("data-media-url") + "\">");
				}*/
				$(this).find("img").css("display","block");
				$(this).find("video").css("display","block");
			}
		});
	}
});
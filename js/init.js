/******
INIT
*******/
gallery.getGallery(0, gallery.setGallery);
$("#main").scroll(function(){
	if(mode === "gallery"){
		if(gallery.lastItem !== null && $(gallery.lastItem).visible(true) === true){
			gallery.showMore();
		}
	}
});
var album = {};
album.id = null;
album.page = 0;
album.posts = [];
album.getAlbum = function(albumId, page, callback){
	album.id = albumId;
	album.page = page;
	request({
    	url: "https://api.imgur.com/3/album/"+albumId+"/images/0.json?page=" + page,
    	headers: {
    	  "Authorization": authorization
    	}
  	}, callback);
};
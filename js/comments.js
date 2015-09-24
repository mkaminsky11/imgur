var comments = {};
comments.sort = "best"; //best|top|new
comments.comments = [];
comments.flat = [];
comments.getComments = function(id, callback){
	request({
        url: ("https://api.imgur.com/3/gallery/" + id + "/comments/" + comments.sort),
        headers: {
          "Authorization": authorization
        }
      }, callback);
}

comments.setComments = function(comment){
	comments.comments = comment;
	for(var i = 0; i < comment.length; i++){
		comments.addFlatComment(comment[i]);
	}
}

comments.addFlatComment = function(comment){
	comments.flat.push(comment);
	for(var i = 0; i < comment.children.length; i++){
		comments.addFlatComment(comment.children[i]);
	}
}
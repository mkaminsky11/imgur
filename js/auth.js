//TODO: albums

var auth = {};
auth.window = null;
auth.login = function(){
	if(auth.window !== null){
		auth.window.close(true);
	}

	auth.window = gui.Window.open(oauth_url, {
		toolbar: false,
		focus: true
	});

	auth.window.on('loaded', function() {
	  var url = auth.window.window.location.href;
	  if(url.indexOf("https://imgur.com/?code=") === 0){
	  	//got it!
	  	code = url.split("?code=")[1];
	  	auth.window.close(true);
	  	auth.window = null;
	  	console.log(code);
	  }
	});
}

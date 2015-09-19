var error = {};
error.showError = function(text){
	$("#error-overlay h6").text(text);
	$("#error-overlay").css("display","block");
}

error.closeError = function(){
	$("#error-overlay").css("display","none");
}
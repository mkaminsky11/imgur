var client_id = "0b4d9e43c145774";
var authorization = "Client-ID " + client_id;
var oauth_url = "https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=code";
var request = require('request');
var code = null;
var mode = "gallery";

/*
BIG TODO LIST

+ conversations
+ subreddits
	- search for subreddit    |-< dropdown to pick?
	- search within subreddit |
+ individual posts [!] -NOW!
	- TODO: ALBUMS!
+ comments [!] -after invidual posts
+ user posts
	- even non-gallery posts [!]
+ visuals for next/prev page
+ escape <, >, other characters
+ check during callbacks
*/
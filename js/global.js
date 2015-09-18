var client_id = "0b4d9e43c145774";
var authorization = "Client-ID " + client_id;
var oauth_url = "https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=code";
var request = require('request');
var code = null;
var mode = "gallery";

/*
BIG TODO LIST

+ user info [!]
+ conversations
+ subreddits
	- search for subreddit    |-< dropdown to pick
	- search within subreddit |
+ individual posts [!]
+ comments [!] -after invidual posts
+ search -now!
	- for posts
+ user posts
	- search
	- click to open
+ visuals for next/prev page

icons:
+ return
+ upload
+ users
+ reddit
+ random
+ search
+ user info
*/
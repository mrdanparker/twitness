//Define some global vars
var setsHighlight = {
	regex : new RegExp("(\\d{1,3}([-,:\\\\/;|\\+]) ?\\d{1,3}(\\2 ?\\d{1,3}){3,7})", "g"),
	replacement : "<span class=\"sets\">$1</span>"
};
var failHighlight = {
	regex : new RegExp("(#?fail(ed)?(ure)?)","gi"),
	replacement : "<span class=\"fail\">$1</span>"
};
var passHighlight = {
	regex : new RegExp("(#?pass(ed)?)","gi"),
	replacement : "<span class=\"pass\">$1</span>"
};
var allTextReplacements = [
	setsHighlight,
	failHighlight,
	passHighlight
];

$(function(){

	// Get the username hash from the url to pass into showTweets
	var hash = "";
	if(window.location.hash){
		hash = window.location.hash.replace("#","");	
	}
	showTweets(hash);

	// Make <enter> in username input trigger showTweets
	$("#username").keyup(function(e){
		if(e.keyCode == 13) {
			showTweets($("#username").val());
		}	
	});

	$("#usernameSearch").click(function(){
		showTweets($("#username").val());
	});

	// Default instruction text in the username input
	var defaultSearchText = "Enter your twitter username...";
	var input = $("#username");
	input.val(defaultSearchText).addClass("defaultText");
	input.focus(function(){
		if (input.val() == defaultSearchText){
			input.val("").removeClass("defaultText");
		}
	});
	input.blur(function(){
		if (input.val() == "") {
			input.addClass("defaultText").val(defaultSearchText);
		}
	});
	
});

function showTweets(username){
	$.twitterSearch({searchText: "hundredpushups", from: username}, function(results){
		// clear previous contents
		$('#recent').slideUp(400, function(){
			$('#recent').empty();
			// append new contents
			for (var i in results) {
				var tweet = results[i];
				var p = $("<p/>"); 
				var user = $("<span/>").text(tweet.from_user).addClass("username");
				var text = $("<span/>").text(tweet.text).addClass("tweetText");
			      	var link = $('<a/>').attr({href:"http://twitter.com/" + tweet.from_user});
				var img = $('<img/>').attr({src:tweet.profile_image_url, alt:"avatar"});
	  			$(link).append(img);
				var p = $("<p/>").append(link).append(user).append(text).addClass('tweet');
				$('#recent').append(p);
			}
			applyTextReplacements(".tweetText");
			updateAddressBarHash(username);
			$('#recent').slideDown(400);
		});
        });
}

// Updates the address bar hash with the given value
function updateAddressBarHash(value){
	if(value){
		window.location.hash = value;
	}
}

// Apply allTextReplacements to elements matching the selector
function applyTextReplacements(selector) {
	$(selector).each(function() {
		for(var i in allTextReplacements) {
			this.innerHTML = this.innerHTML.replace(allTextReplacements[i].regex, allTextReplacements[i].replacement);
		}
	});
}


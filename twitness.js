$(function() {
	showTweets();

	$("#username").keyup(function(e){
		if(e.keyCode == 13) {
			showTweets($("#username").val());
		}	
	});

	$("#usernameSearch").click(function(){
		showTweets($("#username").val());
	});
	
});

function showTweets(username)
{
	$.twitterSearch({searchText:"hundredpushups", from: username}, function(results) {
		// clear previous contents
		$('#recent').slideUp(400, function()
		{
			$('#recent').empty();
			// append new contents
			for (var i in results) {
				var tweet = results[i];
				var p = $("<p/>"); 
				var user = $("<span/>").text(tweet.from_user).addClass("username");
				var text = $("<span/>").text(tweet.text);
			      	var link = $('<a/>').attr({href:"http://twitter.com/" + tweet.from_user});
				var img = $('<img/>').attr({src:tweet.profile_image_url, alt:"avatar"});
	  			$(link).append(img);
				var p = $("<p/>").append(link).append(user).append(text).addClass('tweet');
				$('#recent').append(p);
			}
			$('#recent').slideDown(400);
		});
        });
}


$(function() {
	$.twitterSearch({searchText:"#hundredpushups"}, function(results) {
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
        });
});


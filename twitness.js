$(function() {
	$.twitterSearch({searchText:"hundredpushups"}, function(results) {
		for (var i in results) {
			var tweet = results[i];
			var p = $("<p/>"); 
			var user = $("<span/>").text(tweet.from_user).addClass("username");
			var text = $("<span/>").text(tweet.text);
			var p = $("<p/>").append(user).append(text)
			$('body').append(p);
		}
        });
});

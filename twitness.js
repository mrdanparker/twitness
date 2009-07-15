$(function() {
  var twitterSearch = "http://search.twitter.com/search.json?rpp=10&callback=?&q=";
  $.getJSON(twitterSearch + "hundredpushups", function(data) {
    for (var i in data.results) {
      var tweet = data.results[i];
      var p = $("<p/>"); 
      var user = $("<span/>").text(tweet.from_user).addClass("username");
      var text = $("<span/>").text(tweet.text);
      var p = $("<p/>").append(user).append(text)
      $('body').append(p);
    }
  });
});

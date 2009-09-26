//Define some global vars
var setsHighlight = {
	regex : /(\d{1,3}([-,:\\/;\|\+]) ?\d{1,3}(\2 ?\d{1,3}){3,7})/g,
	replacement : "<span class=\"sets\">$1</span>"
};
var failHighlight = {
	regex : /(#?fail(ed)?(ure)?)/gi,
	replacement : "<span class=\"fail\">$1</span>"
};
var passHighlight = {
	regex : /(#?pass(ed)?)/gi,
	replacement : "<span class=\"pass\">$1</span>"
};
var hashLinking = {
	regex : /(#([a-z]+))(.)/gi,
	replacement : "<a href=\"http://twitter.com/search?q=%23$2\">$1</a>$3"
};
var atLinking = {
	regex : /(@([a-z]+))(.)/gi,
	replacement : "<a href=\"http://twitter.com/$2\">$1</a>$3"
};

var allTextReplacements = [
	setsHighlight,
	failHighlight,
	passHighlight,
	hashLinking,
	atLinking
];

// Default instruction text in the username input
var defaultSearchText = "Enter your twitter username...";

$(function() {

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

	$("#usernameSearch").mouseover(function(){
		$(this).attr("src", "/images/show-hover.png");
	}).mouseout(function(){
		$(this).attr("src", "/images/show.png");
	}).click(function(){
		showTweets($("#username").val());
	});

	$('a[href^="#"]').live('click', function() {
		var username = $(this).attr("href").substring(1);
		showTweets(username);
	});

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
	if (username === defaultSearchText) {
		username = "";
	}
	$("#username").addClass("loading");
	$.twitnessCacheSearch({from: username}, function(results){
		// clear previous contents
		$('#recent').slideUp(400, function(){
			$('#recent').empty();
			if (results.length == 0) {
				$('#graph').hide();
				var item = $('<li/>');
				item.append('No pushup tweets yet for '+ username + '! Start tweeting your pushups, an example is shown below...');
				item.append($('<p class="exampleTweet"/>').append('Passed the first day of #hundredpushups 2,3,2,2,3'));
				$('#recent').append(item);
				applyTextReplacements(".exampleTweet");
			}
			else {
				// iterate over the search results
				var allPlotData = [];
				for (var i in results) {
					var tweet = results[i];
					var sets = extractSetData(tweet.text);
					if(sets) {
						// compile the plot info
						var userPlotData = allPlotData[tweet.from_user] ? allPlotData[tweet.from_user] : [];
						userPlotData[userPlotData.length] = [Date.parse(tweet.created_at), sets.sum];
						allPlotData[tweet.from_user] = userPlotData;
					}
					// append new contents
					var twitnessLink = $('<a/>')
						.attr({href:"#" + tweet.from_user})
						.text(tweet.from_user);
					var user = $("<span/>").append(twitnessLink).addClass("username");
					var text = $("<span/>").text(tweet.text).addClass("tweetText");
					var link = $('<a/>').attr({href:"#" + tweet.from_user});
					var img = $('<img/>').attr({src:tweet.profile_image_url, alt:"avatar"});
		  			$(link).append(img);
					var timestamp = $('<a/>').attr({href:'http://twitter.com/' +  tweet.from_user + '/status/' + tweet.id, 'class':'time'}).text($.timeago(new Date(tweet.created_at)));
					var clear = $('<div class="autoclear"></div>');
					var li = $("<li/>").append(link).append(user).append(text).append(timestamp).append(clear).addClass('tweet');
					$('#recent').append(li);
				}
				applyTextReplacements(".tweetText");
				plotSets($("#graph"), allPlotData, username);
			}
			updateAddressBarHash(username);
			$('#recent').slideDown(400, function(){$("#username").removeClass("loading");});
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

/**
* Parses text to extract information about exercise sets. If there is more than one
* string of sets within text then only data on the first is returned.
* @param text the string to parse for set info
* @return a map of sets data containing: An array of individual set numbers (data.sets), 
* A sum of sets (data.sum) and the highest set number (data.maxConsecutive).
*/
function extractSetData(text) {
	var data = null;
	// pull out the string of sets (i.e. "23,28,23,23,33")
	var setsStrings = text.match(setsHighlight.regex);
	if(setsStrings) {
		data = {};
		// work out which delimiter was used
		var delimiter = setsStrings[0].match(/[-,:\\/;\|\+]/);
		// split the string of sets on the delimiter		
		data.sets = setsStrings[0].split(delimiter);
		// iterate over sets to work out sum and max consecutive
		var sum = 0;
		var maxConsecutive = 0;
		$(data.sets).each(function() {
			var current = parseInt(this);
			sum += current
			maxConsecutive = (current > maxConsecutive) ? current : maxConsecutive;
		});
		data.sum = sum;
		data.maxConsecutive = maxConsecutive;
	}
	return data;
}


function plotSets(placeholder, plotData, username)
{	
	if(username) {
		var data = plotData[username];
		$.plot(placeholder, [ {data: data} ], {xaxis: { mode: "time"} });
		placeholder.show();
	} else {
		placeholder.hide();
	}	
}


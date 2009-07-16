(function($){
    $.extend({
        twitterSearch : function(options, func){
			var invalidSearch = (!options.from && !options.to && !options.searchText)
			options = $.extend({}, $.twitterSearch.defaults, options, {
				searchText: invalidSearch ? "mrdanparker OR rapaul OR alexcuesta" : options.searchText
				}); // notice the easter egg!
				
            var url = "http://search.twitter.com/search.json?callback=?";           
			
            // limit results if required
            if(options.limit){
                url += "&rpp=" + options.limit
            }

            // build q=...
            url += "&q=";
            var plus = "";
            if(options.searchText){
                url += plus + options.searchText;
                plus = "+";
            }
            if(options.from){
                url += plus + "from:" + options.from;
                plus = "+";
            }
            if(options.to){
                url += plus + "to:" + options.to;
                plus = "+";
            }
			
            // request the JSON and invoke func to deal with the result
            $.getJSON(url, function(data){
                if(typeof func == 'function'){
                    func.call(this, data.results);
                }
            });
        }
    });
	
	$.twitterSearch.defaults = {
		from: null,
		to:	null,
		limit: 10,
		searchText: null
	};
})(jQuery);
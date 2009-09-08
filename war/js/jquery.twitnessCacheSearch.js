(function($){
    $.extend({
        twitnessCacheSearch : function(options, func){
    		var url;
    		if(options.from) {
				url = "/api/user/"+options.from;
			} else {
				url = "/api/public/";
			}

            // request the JSON and invoke func to deal with the result
            $.getJSON(url, function(data){
                if(typeof func == 'function'){
                    func.call(this, data.results);
                }
            });
        }
    });

})(jQuery);

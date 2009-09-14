import com.google.appengine.api.datastore.*
import net.sf.json.JSONObject
import net.sf.json.JSONArray

def restParts = request.requestURI.tokenize('/')
def datastoreService = DatastoreServiceFactory.getDatastoreService()

switch (request.method) {
	case "GET" :
		def username = restParts[2]
        if(username) {
        	Query query = new Query("tweet")
        	.addSort("created_at", Query.SortDirection.DESCENDING)
        	.addFilter("from_user", Query.FilterOperator.EQUAL, username)
        	Iterator<Entity> tweets = datastoreService.prepare(query).asIterator()
        	
        	JSONArray jsonArray = new JSONArray()
        	for(Entity tweet : tweets ) {
        		JSONObject tweetJson = new JSONObject()
        		tweetJson.put("text", tweet.text)
        		tweetJson.put("to_user_id", tweet.to_user_id)
        		tweetJson.put("from_user", tweet.from_user)
        		tweetJson.put("id", tweet.id)
        		tweetJson.put("from_user_id", tweet.from_user_id)
        		tweetJson.put("iso_language_code", tweet.iso_language_code)
        		tweetJson.put("source", tweet.source)
        		tweetJson.put("profile_image_url", tweet.profile_image_url.toString())
        		tweetJson.put("created_at", tweet.created_at.toString())
        		jsonArray.add(tweetJson)
        	}
        	JSONObject resultsObj = new JSONObject()
        	resultsObj.element("results", jsonArray)
        	response.setContentType("application/json")
    		print resultsObj.toString()
        }
	break;
}
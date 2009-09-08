import com.google.appengine.api.datastore.*
import net.sf.json.JSONObject

def datastoreService = DatastoreServiceFactory.getDatastoreService()

switch (request.method) {
	case "GET" :
        Query query = new Query("tweet")
        .addSort("created_at", Query.SortDirection.DESCENDING)
        Iterator<Entity> tweets = datastoreService.prepare(query).asIterator()
        
        JSONObject json = new JSONObject()
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
			tweetJson.put("created_at:", tweet.created_at.toString())
        	json.accumulate("results", tweetJson)
        }
        response.setContentType("application/json")
		print json.toString()
	break;
}
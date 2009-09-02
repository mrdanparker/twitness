import com.google.appengine.api.datastore.*
import com.google.appengine.api.urlfetch.*
import java.net.URL
import java.util.logging.Logger;
import net.sf.json.*
import net.sf.json.groovy.JsonSlurper

/**
 * Script to cache the given search term in the datastore periodically
 * Should ideally be invoked by a cron job
 */
def datastoreService = DatastoreServiceFactory.getDatastoreService()
def fetchService = URLFetchServiceFactory.getURLFetchService()
def log = Logger.getAnonymousLogger();

// Load the ID of the last successful query
Entity since = datastoreService.prepare(new Query('since')).asSingleEntity()
long sinceId = 0
// Fall back to 0 if no queries have been performed (first time server is run)
if (since) {
	sinceId = since.since_id
} else {
	since = new Entity('since')
}

String queryTerm = 'hundredpushups'
String twitterUrl = "http://search.twitter.com/search.json?q=$queryTerm&rpp=500"	// 500 = max put size for datastore

def url = twitterUrl += "&since_id=$sinceId"
def result = fetchService.fetch(new URL(url))
def json = new JsonSlurper().parseText(new String(result.content))

def latestTweets = []
json.results.each {
	def tweet = new Entity("tweet")
	tweet.term = queryTerm
	it.each { key, value ->
		tweet[key] = getValue(value)
	}
	latestTweets << tweet
}
if (latestTweets) {	// If there are new tweets
	log.info "Storing ${latestTweets.size()} new tweets" 
	datastoreService.put latestTweets
	log.debug 'Tweets Stored'
} else {
	log.debug 'No new tweets'
}

// Only update the since value if we have new tweets (else it will be -1)
if (json.max_id > 0) {
	since.since_id = json.max_id 
	datastoreService.put since
}

//Translate null JSON values to a null in groovy.
//http://www.nabble.com/RESTClient%2C-JSON---null-values-tt25094142.html
def getValue(value) {
	if (value instanceof JSONObject && value.isNullObject()) // value instanceof JSONObject && value.isNullObject())
		return null
	else
		return value
}

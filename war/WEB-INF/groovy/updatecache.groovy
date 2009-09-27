import com.google.appengine.api.datastore.*
import com.google.appengine.api.urlfetch.*
import java.net.URL
import java.text.SimpleDateFormat
import java.util.logging.Logger
import net.sf.json.*
import net.sf.json.groovy.JsonSlurper

/**
 * Script to cache the given search term in the datastore periodically
 * Should ideally be invoked by a cron job
 */
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

String queryTerm = 'hundredpushups+OR+100pushups+OR+100pushupsrva'
String twitterUrl = "http://search.twitter.com/search.json?q=$queryTerm&rpp=500"	// 500 = max put size for datastore

def url = twitterUrl += "&since_id=$sinceId"
def result = fetchService.fetch(new URL(url))
def json = new JsonSlurper().parseText(new String(result.content))

def df = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z", Locale.US)

def latestTweets = []
json.results.each {
	def tweet = new Entity("tweet")
	tweet.term = queryTerm
	tweet.created_at = df.parse(it.created_at)
	tweet.from_user = it.from_user
	tweet.from_user_id = it.from_user_id
	tweet.id = it.id
	tweet.iso_language_code  = it.iso_language_code
	tweet.profile_image_url = new Link(it.profile_image_url)
	tweet.source = it.source
	tweet.text = it.text
	tweet.to_user = it.to_user
	tweet.to_user_id = getValue(it.to_user_id)	// Can be null so use special handler
	latestTweets << tweet
}
if (latestTweets) {	// If there are new tweets
	log.info "Storing ${latestTweets.size()} new tweets" 
	datastoreService.put latestTweets
	log.fine 'Tweets Stored'
} else {
	log.fine 'No new tweets'
}

// Only update the since value if we have new tweets (else it will be -1)
if (json.max_id > 0) {
	since.since_id = json.max_id 
	datastoreService.put since
}

// Translate null JSON values to a null in groovy.
def getValue(value) {
	if (value instanceof JSONNull)
		return null
	else
		return value
}

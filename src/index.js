var https = require('https');
var http = require('http');
var events = require('events');
var util = require('util');
var eventEmitter = new events.EventEmitter();

var user = '7c63a1332d28e1701fe504ef0c6ee872';
var pass = 'f4cee1643802b44ec24737527d83239e';
var extension = '';
var body = '';
var info = '';
var year = ''; //Movies from OMDB
var result = '';
var poster = '';



exports.handler = (event, context) => { 

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log('LAUNCH REQUEST')
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to Trinity Music. How may I help you?", false),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log('INTENT REQUEST');

        switch(event.request.intent.name) {
          case "GetMovie":
          	var attempts = 0;
          	var self;
          	var title = event.request.intent.slots.Title.value;
          	if(title === undefined){
          		context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, I didn't hear a movie title given. I am ready to try again.", false),
            						{}
          						)
          					)	
          	}
          	else{
          	console.log(title);
          	result = title.toLowerCase();
			var index = 0;
    		for(var i = 0; i<result.length; i++)
            {
	        	index++;
	        	if(result[i]===" ")
	        	{
		        	result = result.replaceAt(index, "-", title);
	        	}
        	}
        	console.log(result);
        	
        	Eventer = function(){
				 events.EventEmitter.call(this);
				 
				 //ACCESS TMDB//
			this.getYear = function(){
				self = this;
		        	http.get('http://api.themoviedb.org/3/search/movie?api_key=fc88acbc5397f84449dc18dc298f859c&query='+result, function(res){
		        	console.log("STATUS: " +res.statusCode);
		   				body = '';
		   				res.on('data', function(chunk) {
		      				body += chunk;
		   				});
		   				res.on('end', function() {
		    				try {
                                console.log(body);
		                		info = JSON.parse(body);

                                var out = 0;
                                for(var i = 0; i < info.results.length; i++){
                                    var Otitle = title.toLowerCase();
                                    var Ttitle = info.results[i].title.toLowerCase();
                                    Ttitle = Ttitle.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                                    console.log(Ttitle);
                                    if(Otitle.localeCompare(Ttitle) === 0){
                                        year = info.results[i].release_date;
                                        year = year.substring(0,4);

                                        poster = info.results[i].poster_path;
                                        poster = 'https://image.tmdb.org/t/p/w185/'+poster;
                                        self.emit('tuneList', year);
                                        out = 1;
                                        i = info.results.length;
                                    }
                                }
                                if(out === 0){
                                    year = info.results[0].release_date;
                                    year = year.substring(0,4);

                                    poster = info.results[0].poster_path;
                                    poster = 'https://image.tmdb.org/t/p/w185/'+poster;

                                    title = info.results[0].title;
                                    title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                                    result = title.toLowerCase();
                                    index = 0;
                                    for(var i = 0; i<result.length; i++)
                                    {
                                        index++;
                                        if(result[i]===" ")
                                        {
                                            result = result.replaceAt(index, "-", title);
                                        }
                                    }

                                    self.emit('tuneList', year);
                                    out = 1;
                                }

		                		// data is available here:
		                		console.log(info);
		                		console.log(year);
                                console.log(poster);
		                		
		              
		            		} catch (e) {
		                		console.log('Error parsing JSON!');
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse("I'm sorry, there was an issue finding songs for " + title +". I am ready to try again", false),
                                        {}
                                    )
                                )
		        		 	}	
		   				})
		   				res.on('error', function(e) {
		      			console.log("Got error: " + e.message);
		      			attempts = 2;
		   			});
					});
				}
        	}
        	util.inherits(Eventer, events.EventEmitter);
        	
        	 Listener = function(){
        		this.tuneList = function(year){
        			attempts++;
        			if(attempts < 2){
        				console.log("movie/"+result+"-"+year);
        				tunefind("movie/"+result+"-"+year);
        			}
        			else{
        				console.log("movie/"+result);
        				tunefind("movie/"+result);	
        			}
        			
        		}
        	}
        	var eventer = new Eventer();
        	var listener = new Listener(eventer);
        	eventer.on('tuneList', listener.tuneList);
        	eventer.getYear();
        	
        	tunefind = function(extension){
			//TUNEFIND OPTIONS//
				var options = {
   					host: 'www.tunefind.com',
   					port: 443,
   					path: '/api/v1/'+extension,
   					method: 'GET',
   				headers: {
      				'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
   				} 
			};
			
		//ACCESS TUNEFIND//
	    https.get(options, function(res){
			    console.log("STATUS: " +res.statusCode);
   				body = '';
   				res.on('data', function(chunk) {
      				body += chunk;
   				});
   				res.on('end', function() {
    				try {
                		info = JSON.parse(body);
                		var song = info.songs[0].name;
                		// data is available here:
                		var content = "";
                		for(var i = 0; i < info.songs.length; i++){
                			content = content + info.songs[i].name + " by " +info.songs[i].artist.name + "\r\n";
                			
                		}
                		var titleC = capitalizeEachWord(title);
                		var header = "Here are some songs in " + titleC;
                		console.log(info);
                		console.log(song);
                		console.log(content);
                		console.log(header);
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponsePoster('A song in the Movie ' +title + ', is ' + song +". All songs in this movie can be found in your Alexa app", header, content, poster, true),
                    			{}
                			 )
                		)
                		
            		} catch (e) {
            			if(attempts < 2){
            				self.emit('tuneList', year);
            			}
            			else{
            				console.log('Error parsing JSON!');	
            				context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, there was an issue finding songs for " + title +". I am ready to try again", false),
            						{}
          						)
          					)
            			}
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			});
			}
          	}
            break;

          case "GetTV":
          	var show = event.request.intent.slots.Show.value;
            var season = event.request.intent.slots.Season.value;
            var episode = event.request.intent.slots.Episode.value;
            console.log("Show: " + show);
            console.log("Season: " + season);
            console.log("Episode: " + episode);
            if(show === undefined || season === undefined || episode === undefined){
          		context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, I didn't hear a season, episode, and show title given. I am ready to try again.", false),
            						{}
          						)
          					)	
          	}
          	else{
            console.log(show);
          	//var endpoint = "https://www.tunefind.com/api/v1/show"; // ENDPOINT GOES HERE
            //var body = ""
            var result = show.toLowerCase();
			var index = 0;
    		for(var i = 0; i<result.length; i++)
            {
	        	index++;
	        	if(result[i]===" ")
	        	{
		        	result = result.replaceAt(index, "-", show);
	        	}
        	}
        	console.log(result);
        	
			
		//ACCESS TUNEFIND//
		Eventer = function() {
			events.EventEmitter.call(this);
			
			this.getPoster = function(){
				self = this;
		        	http.get('http://api.themoviedb.org/3/search/tv?api_key=fc88acbc5397f84449dc18dc298f859c&query='+result, function(res){
		        	console.log("STATUS: " +res.statusCode);
		   				body = '';
		   				res.on('data', function(chunk) {
		      				body += chunk;
		   				});
		   				res.on('end', function() {
		    				try {
                                console.log(body);
		                		info = JSON.parse(body);

                                poster = info.results[0].poster_path;
                                poster = 'https://image.tmdb.org/t/p/w185/'+poster;
                                self.emit('poster', poster);

		                		// data is available here:
		                		console.log(info);
                                console.log(poster);
		                		
		              
		            		} catch (e) {
		                		console.log('Error parsing JSON!');
		        		 	}	
		   				})
		   				res.on('error', function(e) {
		      			console.log("Got error: " + e.message);
		   			});
					});
				}
			
			this.getID = function(){
			var self = this;
			
			//TUNEFIND OPTIONS//
				var options = {
   					host: 'www.tunefind.com',
   					port: 443,
   					path: '/api/v1/show/'+result+'/season-'+season,
   					method: 'GET',
   				headers: {
      				'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
   				} 
			};
			
	    https.get(options, function(res){
			    console.log("STATUS: " +res.statusCode);
   				body = '';
   				res.on('data', function(chunk) {
      				body += chunk;
   				});
   				res.on('end', function() {
    				try {
                		info = JSON.parse(body);
                		var id = info.episodes[episode-1].id;
                		// data is available here:
                		console.log(info);
                		console.log(id);
                		self.emit('tuneList', id);
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponse("I'm sorry, there was an issue finding songs for season " + season + ", episode " + episode + ", of " + show +'. I am ready to try again', false),
                    			{}
                			 )
                		)
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			}); 
			}//Tunefind ends here
			}
			util.inherits(Eventer, events.EventEmitter);
 			
 			Listener = function(){
        		this.tuneList = function(id){
        			console.log("show/"+result+"/season-"+season+"/"+id);
        			tunefind("show/"+result+"/season-"+season+"/"+id);
        		}
        		
        		this.poster = function(poster){
        			eventer.getID();
        		}
        	}
        	var eventer = new Eventer();
        	var listener = new Listener(eventer);
        	eventer.on('tuneList', listener.tuneList);
        	eventer.on('poster', listener.poster)
        	eventer.getPoster();
        	
        	tunefind = function(extension){
			//TUNEFIND OPTIONS//
				var options = {
   					host: 'www.tunefind.com',
   					port: 443,
   					path: '/api/v1/'+extension,
   					method: 'GET',
   				headers: {
      				'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
   				} 
			};
			
		//ACCESS TUNEFIND//
	    https.get(options, function(res){
			    console.log("STATUS: " +res.statusCode);
   				body = '';
   				res.on('data', function(chunk) {
      				body += chunk;
   				});
   				res.on('end', function() {
    				try {
                		info = JSON.parse(body);
                		var song = info.songs[0].name;
                		// data is available here:
                		var content = "";
                		for(var i = 0; i < info.songs.length; i++){
                			content = content + info.songs[i].name + " by " +info.songs[i].artist.name + "\n\n";
                			
                		}
                		var showC = capitalizeEachWord(show);
                		var header = "Here are some songs in Season " + season + ", Episode " + episode + ', of ' + showC;
                		console.log(info);
                		console.log(song);
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponsePoster('A song in season ' +season + ', episode ' + episode + ', of '+ show + ', is ' + song +". More songs in this episode can be found in your Alexa app", header, content, poster, true),
                    			{}
                			 )
                		)
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
                		context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, there was an issue finding songs for season " + season + ", episode " + episode + ", of " + show +'. I am ready to try again', false),
            						{}
          						)
          					)
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			});
			}
          	}
            break;

          case "GetArtist":
          	var name = event.request.intent.slots.Name.value;
          	if(name === undefined){
          		context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, I didn't hear an artist name given. I am ready to try again.", false),
            						{}
          						)
          					)	
          	}
          	else{
          	console.log(name);
			var res = name.toLowerCase();
			var index = 0;
    		for(var i = 0; i<res.length; i++)
            {
	        	index++;
	        	if(res[i]===" ")
	        	{
		        	res = res.replaceAt(index, "-", name);
	        	}
        	}

            console.log(res);
            //TUNEFIND OPTIONS//
				var options = {
   					host: 'www.tunefind.com',
   					port: 443,
   					path: '/api/v1/artist/'+res,
   					method: 'GET',
   				headers: {
      				'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
   				} 
			};
			
		//ACCESS TUNEFIND//
	    https.get(options, function(res){
			    console.log("STATUS: " +res.statusCode);
   				body = '';
   				res.on('data', function(chunk) {
      				body += chunk;
   				});
   				res.on('end', function() {
    				try {
                		info = JSON.parse(body);
                		var song = info.songs[0].name;
                		// data is available here:
                		console.log(info);
                		console.log(song);
                		
                		var content = "";
                		for(var i = 0; i < info.songs.length; i++){
                			if(i === 0){
                				content = content + info.songs[i].name + "\n";	
                			}
                			else if(info.songs[i].name != info.songs[i-1].name){
                				content = content + info.songs[i].name + "\n";
                				//content = "\t" + content + info.songs[i].tunefind_url + "\n";
                			}
                			
                			
                		}
                		var nameC = capitalizeEachWord(name);
                		var header = "Here are some songs by " + nameC;
                		
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponseCard('A song by the artist ' +name + ', is ' + song + '. More songs by this artist can be found in your Alexa app', header, content, true),
                    			{}
                			 )
                		)
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
                		context.succeed(
            					generateResponse(
            						buildSpeechletResponse("I'm sorry, there was an issue finding songs by " + name +". I am ready to try again", false),
            						{}
          						)
          					)
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			});
          	}
            break;
            
         case "AMAZON.HelpIntent":
      	    console.log('HELP REQUEST');
      	    context.succeed(
                generateResponse(
                    buildSpeechletResponse('You can ask me for songs in a movie, a tv show with name, season, and episode number, or from a particular artist.... How may I help you?', false),
                    {}
                )
            )
        break;
        
        case "AMAZON.CancelIntent":
      	    console.log('HELP REQUEST');
      	    context.succeed(
                generateResponse(
                    buildSpeechletResponse('Thank you for using Trinity Music', true),
                    {}
                )
            )
        break;
        
        case "AMAZON.StopIntent":
      	    console.log('HELP REQUEST');
      	    context.succeed(
                generateResponse(
                    buildSpeechletResponse('Thank you for using Trinity Music', true),
                    {}
                )
            )
        break;

          default:
            throw "Invalid intent"
        }

        break;
     

      case "SessionEndedRequest":
        // Session Ended Request
        console.log('SESSION ENDED REQUEST')
        break;

      default:
        context.fail('INVALID REQUEST TYPE: ${event.request.type}')

    }

  } catch(error) { context.fail('Exception: '+error) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}
buildSpeechletResponseCard = (outputText, title, content, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    card: {
      type: "Simple",
      title: title,
      content: content
    },
    shouldEndSession: shouldEndSession
  }

}

buildSpeechletResponsePoster = (outputText, title, content, poster, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    card: {
      type: "Standard",
      title: title,
      text: content,
      image: {
      	largeImageUrl: poster
      }
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }


}
String.prototype.replaceAt  = function(index, character, string)
{
	return this.substr(0, index-1) + character + this.substr(index, string.length);
}

function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


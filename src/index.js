var https = require('https');
var http = require('http');

var user = '7c63a1332d28e1701fe504ef0c6ee872';
var pass = 'f4cee1643802b44ec24737527d83239e';
var extension = '';
var body = '';
var info = '';



exports.handler = (event, context) => { 

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log('LAUNCH REQUEST')
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to Trinity. How may I help you?", false),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log('INTENT REQUEST')

        switch(event.request.intent.name) {
          case "GetMovie":
          	var title = event.request.intent.slots.Title.value;
          	console.log(title);
          	
          	//TUNEFIND OPTIONS//
				var options = {
   					host: 'www.tunefind.com',
   					port: 443,
   					path: '/api/v1/movie/'+title,
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
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponse('A song in the movie ' +title + ', is ' + song, true),
                    			{}
                			 )
                		)
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			});
            break;

          case "GetTV":
          	var show = event.request.intent.slots.Show.value;
            var season = event.request.intent.slots.Season.value;
            var episode = event.request.intent.slots.Episode.value;
            console.log(show);
          	//var endpoint = "https://www.tunefind.com/api/v1/show"; // ENDPOINT GOES HERE
            //var body = ""
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse('The show is ' + show + ', the season is ' + season + ', the episode is ' + episode, true),
                    {}
                  )
                )
            break;

          case "GetArtist":
          	var name = event.request.intent.slots.Name.value;
          	console.log(name);
			var res = name.toLowerCase();
			var index = 0;
    		for(var i = 0; i<res.length; i++)
            {
	        	index++;
	        	if(res[i]===" ")
	        	{
		        	break;
	        	}
        	}
	        res = res.replaceAt(index, "-", name);

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
                		context.succeed(
                  			generateResponse(
                    			buildSpeechletResponse('A song by the artist ' +name + ', is ' + song, true),
                    			{}
                			 )
                		)
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
        		 	}	
   				})
   				res.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
			});

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
                    buildSpeechletResponse('Thank you for using Trinity', true),
                    {}
                )
            )
        break;
        
        case "AMAZON.StopIntent":
      	    console.log('HELP REQUEST');
      	    context.succeed(
                generateResponse(
                    buildSpeechletResponse('Thank you for using Trinity', true),
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

  } catch(error) { context.fail('Exception: ${error}') }

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

var tunefind = function(extension){
	var options = {
   host: 'www.tunefind.com',
   port: 443,
   path: '/api/v1/'+extension,
   method: 'GET',
   // authentication headers
   headers: {
      'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
   } 
	};

	var req = https.get(options, function(res){
			    console.log("STATUS: " +res.statusCode);
   				body = '';
   				res.on('data', function(chunk) {
      				body += chunk;
   				});
   				res.on('end', function() {
    				try {
                		info = JSON.parse(body);
                		var test = info.songs[0].name;
                		//context.succeed(
          					generateResponse(
            					buildSpeechletResponse("This is outputting", false),
            					{}
          					)
        				//)
                		// data is available here:
                		console.log(info);
                		console.log(test);
                		
            		} catch (e) {
                		console.log('Error parsing JSON!');
        		 	}	
   				})
			});
   				
   			req.on('error', function(e) {
      			console.log("Got error: " + e.message);
   			});
}









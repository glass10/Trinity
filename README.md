![alt text](http://i.imgur.com/FEAYSP3.jpg)

# Trinity Music
An Amazon Alexa Skill that uses the TuneFind API to give song information for Movies, TV Shows, and Artists

## Inspiration 
-Coming Soon-

## What it does
The skill Trinity Music takes in the user’s request to find information on songs that are in a TV show or Movie, as well as music featured in these by a certain artist. The user can ask a question that includes the name of the movie, the TV show with the season and episode, or the artist name, and in return Trinity Music will supply a list of songs that are found, as well as a card in the application with a list of songs, who they are by, and a poster image of the movie.

## How we built it
The skill Trinity Music was built using the both the TuneFind and OMDB APIs. With the TuneFind API, input by the user was taken in to get specific information from the TuneFind service. This includes information such as the name of the movie, the name of the TV show, season and episode number, or the name of the artist. The OMDB API was used to get information such as when a movie was released to complete our access to the TuneFind API, as well as for Movie and TV posters within the cards. Giving the specific information to the TuneFind API would return a list of songs that are found in the given information. 

## Challenges we ran into
Some of the challenges that arose include difficulties connecting with the API. Specifically, with the TuneFind API, it required specific information that was sometimes difficult to find; especially with movies. With the movies, it usually, but not always, requires a year. This required us to access the OMDB Database to get the year so we could get all the information we needed to call the TuneFind API successfully. With little to no JavaScript experience in our group, it was an experience to adjust from Java/C and make successful HTTP requests in an asynchronous environment.

## Accomplishments that we're proud of
Though there were some distinct milestones that we hit during the development of the skill that really kept us motivated, such as successfully accessing the TuneFind API for the first time, this entire experience is something we are proud of. Coming from a background in Java and currently studying C/C++ in our courses, the asynchronous environment of JavaScript/Node was something very new to us and took a lot to understand how to work with this. Also, we are taught in controlled environments where test cases aid in our development on lab machines. Working with a product like Alexa is something we have never done and definitely, have not been taught to do.  Working with different environments like this is something we enjoy doing and any opportunity to do so will be met with more optimism than before.

## What we learned
As stated above, this project allowed us to learn more about a new programming language, as well as a new platform to develop on. Not only that, but our experience with APIs in a functional environment was lacking and this project provided us with the necessary experience to have a better foundation for using them in the future. Additionally, the use of AWS to host our skill was definitely a new experience to us as our code was solely hosted, and tested on the cloud. This gave us a different challenge in collaboration, as well as being somewhat limited in what could be imported as additional libraries to be used. Overall, we learned a lot from this experience and are excited to use this to expand our horizons as Computer Science students in the future.

## What's next for Trinity Music
Though we have a strong foundation here, we hope to build upon this in the future in a couple of different ways. First off, developing for the TV Shows was a pain at times, and we are not entirely happy with the way a user interacts with it as of now. It works, but we know there is an improvement to be had in how a user interacts with our app with their voice, which is something we are not used to thinking about. Beyond that, we hope to improve the skill through more bug testing, more sample utterances, and better looking, and more educational, cards at the end of a successful interaction.

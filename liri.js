//hiding stuff. like demerits or detention slips...

require("dotenv").config();

//providing things: 3 packages, 1 js file, and a module. Still confused by fs. I wanted to bonus but i didn't

var keys = require("./key.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");



//helping the package with my key info. 
//this is me declaring an object using a constructor function from the 
//node-spotify-api-package. It's constructor is defined in the index.js of the 
//dist folder....then required in index.js of the root. Is that weird?

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//helping the package with my key info. 
//this is me declaring an object using a constructor function from the 
//twitter-package. Twitter pack is not as snakey as spotify

var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

//arghhhhhs!

var userRequest = process.argv[2];
var userInput = process.argv[3];

//spotify search func, sets a default query, overides it if user input isnt blank

function spot() {
    var def = "Ace of Base, The Sign";
    if (userInput !== undefined) {
        def = userInput;
    }
    spotify.search({
        type: "track",
        query: def
    }, function (err, data) {
        if (err) {
            console.log("error " + err);
            return;
        } else {
            var song = data.tracks.items[0];
            console.log(" ")
            console.log("Band: " + song.artists[0].name)
            console.log("Song Title: " + song.name)
            console.log("Album Title: " + song.album.name)
            console.log("Preview Link: " + song.preview_url)
            console.log(" ")
        }
    })

}

//twit func grabs my tweets. remember to limit tweets to 20...then make 20 tweets

function twit() {
    client.get("statuses/user_timeline", {
        screen_name: "BillyGNolan"
    }, function (error, tweets, response) {
        if (error) throw error;
        for (i = 0; i <= (tweets.length) - 1; i++) {
            var time = tweets[i].created_at;
            var date = time.slice(0, 11);
            var clock = time.slice(11, 16)
            var text = tweets[i].text;
            var name = tweets[i].user.name;
            console.log(" ")
            console.log("On " + date);
            console.log("At " + clock);
            console.log(name + " Tweeted:");
            console.log(text);
            console.log(" ")

        }
    })
}

//movie search func, sets a default query, overides it if user input isnt blank.
//Who actually likes Jared Leto? I mean i get it....his face and all
//but what else? His band is high school poetry bad

function mov() {
    var def = "Mr. Nobody";
    if (userInput !== undefined) {
        def = userInput;
    }
    request("http://www.omdbapi.com/?t=" + def + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieData = JSON.parse(body);
            console.log(" ");
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value + " rotten.");
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log(" ");
        } else {
            console.log(error);
        }
    })
}

//my user's choice "logic". This works but feels weird. 
//Looked for alternatives that weren't switches. Saw this article
//https://hackernoon.com/rethinking-javascript-the-if-statement-b158a61cd6cb
//nested ternaries? what...who? HE kills off the if else then claims for loops are 
//done too

if (userRequest === "spotify-this-song") {
    spot();
}
if (userRequest === "my-tweets") {
    twit();
}
if (userRequest === "movie-this") {
    mov();
}
if (userRequest === "do-what-it-says")
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.error(err);
        } {
            var argies = data.split(",");
            //userRequest= argies[0];
            userInput = argies[1];
            spot();
        }
    });
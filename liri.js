require("dotenv").config();

var keys = require("./key.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");




var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});


var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

var userRequest = process.argv[2];
var userInput = process.argv[3];


function spot() {
    spotify.search({
        type: "track",
        query: userInput
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

function mov() {
    request('http://www.omdbapi.com/?t=' + userInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
        }
        else {
            console.log(error);
        }
    })
}

if (userRequest === "spotify-this-song") {
    spot();
} if (userRequest === "my-tweets") {
    twit();
} if (userRequest === "movie-this") {
    mov();
} if (userRequest === "do-what-it-says")
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
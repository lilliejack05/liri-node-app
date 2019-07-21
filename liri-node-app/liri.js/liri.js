require("dotenv").config();

// Creates a variable to hold the file keys.js
var keys = require('./keys.js');

// Creates a variable to hold the twitter npm package
var Twitter = require('twitter');
// Creates a variable to hold the spotify npm package
var Spotify = require('node-spotify-api');
// Creates a variable to hold the request npm package
var request = require('request');
// Requires file-system
var fs = require("fs");

// Put twitter commands in a function so it only runs when it is called
var getMyTweets = function () {

  var client = new Twitter(keys.twitterKeys);

  var params = { screen_name: 'LiriBootCampBot' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log('');
        console.log(tweets[i].text);
      }
    }
  });
}
var getArtistNames = function (artist) {
  return artist.name;
}
var getMeSpotify = function (songName){
var spotify = new Spotify(keys.spotifyKeys);

if (songName == "" || songName == null) {
  songName = "The Sign"
}
 
spotify.search({ type: 'track', query: songName }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
var songs = data.tracks.items; 
for (var i=0; i<songs.length; i++) {
console.log(i);
console.log('artist(s): ' + songs[i].artists.map(
  getArtistNames));
console.log('song name: ' + songs[i].name);
console.log('preview song: ' + songs[i].preview_url);
console.log('album ' + songs[i].album.name);
console.log('================================================');
};
});
}

var getMovies = function (movieName) {
request('http://www.omdbapi.com/?i=tt3896198&apikey=67cc3162' + movieName + '&y=&plot=short&r=json', function (error, response, body) {
  if (movieName == "" || movieName == null) {
    movieName = "Mr. Nobody"
  }
  if(!error && response.statusCode == 200) {
    var jsonData = JSON.parse(body);

    console.log('Title: ' + jsonData.Title);
    console.log('Year: ' + jsonData.Year);
    console.log('Rating: ' + jsonData.Rated);
    console.log('IMDB Rating: ' + jsonData.imdbRating);
    console.log('Country: ' + jsonData.Country);
    console.log('Language: ' + jsonData.Language);
    console.log('Plot: ' + jsonData.Plot);
    console.log('Actors: ' + jsonData.Actors);
    console.log('Rotten Tomato Rating: ' + jsonData.tomatoRating);
    console.log('Rotten Tomato URL: ' + jsonData.tomatoURL);
    
  }
});
}
var doWhatItSays = function (){
// Uses file system package to read the random.txt file
fs.readFile('random.txt', 'utf8', function (err, data) {
  if (err) throw err;

  var dataArr = data.split(',');

  if (dataArr.length == 2) {
    pick(dataArr[0], dataArr[1]);
  } else if (dataArr.length == 1) {
    pick(dataArr[0]);
  }
});
}

// Create switch statement that will hold arguments given by user
var pick = function (caseData, functionData) {
  switch (caseData) {
    case 'my-tweets' :
    getMyTweets();
    break;
    case 'spotify-this-song':
    getMeSpotify(functionData);
    break;
    case 'movie-this':
    getMovies(functionData);
    break;
    case 'do-what-it-says':
    doWhatItSays();
    break;
    default:
    console.log('LIRI does not know that');
  }
}

var runThis = function (argOne, argTwo) {
  pick(argOne, argTwo);
};

//Referencing whatever arguments the user enters
runThis(process.argv[2], process.argv[3]);
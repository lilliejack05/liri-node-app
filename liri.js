require("dotenv").config();

// creates a variable to hold the file keys.js
var keys = require('./keys.js');
var OMDBkey = "67cc3162";
var axios = require("axios");
// create a variable to hold spotify npm package
var Spotify = require("node-spotify-api");
var  spotify = new Spotify(keys.spotify);
//create a variable to hold the request npm package
var request = require('request');
var  moment = require("moment");
// requires file-system
var  fs = require("fs");
var inquirer = require("inquirer");

let count = 0;
function liriSearch() {
  if (!process.argv[2]) {
    inquirer
      .prompt([{
        name: "whatAPI",
        message: "Welcome to Liri! What can I help you with today?",
        type: "list",
        choices: ["Look up a movie", "Look up a song", "Look up a concert", "take a chance"]
      }]).then(function (response) {
        count++;
        switch (response.whatAPI) {
          case "Look up a movie":
            return console.log("Type this: 'node liri.js + movie-this + the movie of your choice (minus the +)");
          case "Look up a song":
            return console.log("Type this: node liri.js + spotify-this-song + the song of your choice (minus the +)");
          case "Look up a concert":
            return console.log("Type this: node liri.js + concert-this + the artist of your choice (minus the +)");
          case "take a chance":
            return console.log("Type this: node liri.js + do-what-it-says (minus the +)");
        }
      })
  }
}
liriSearch();
//Capturing console input to determine which part of app to run
let apiType = process.argv[2];
let Search = process.argv.slice(3).join(" ");
let commandLog = process.argv;
//Switch used to determine which API to interact with
switch (apiType) {
  case "spotify-this-song":
    songFinder();
    break;
  case "movie-this":
    if (Search === "") {
      Search = "mr nobody";
    }
    //Search += "+";
    movieFinder()
    break;
  case "concert-this":
    bandFinder();
    break;
  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.split(",");
      //apiType = data[0];
      Search = data[1];
      songFinder();
    })
};
//Function to search spotify
function songFinder() {
  //Testing spotify
  spotify.search({
      type: 'Push It',
      query: Search,
      limit: 1,
    }).then(function (response) {
      console.log(
        "\nArtist/s: " + response.tracks.items[0].album.artists[0].name +
        "\nSong Title: " + response.tracks.items[0].name +
        "\nPreview URL: " + response.tracks.items[0].preview_url +
        "\nAlbum: " + response.tracks.items[0].album.name
      );
      //Clears search for logging purposes
      if (apiType === "do-what-it-says") {
        Search = "";
      }
      //appends each command to the log.txt file
      fs.appendFile("log.txt",
        "\n------\n" +
        "\n" + "node liri.js " + apiType + " " + Search + "\nArtist/s: " + response.tracks.items[0].album.artists[0].name +
        "\nSong Title: " + response.tracks.items[0].name +
        "\nPreview URL: " + response.tracks.items[0].preview_url +
        "\nAlbum: " + response.tracks.items[0].album.name,
        function (err) {
          if (err) {
            return console.log(err);
          }
        });
    })
    .catch(function (err) {
      console.log(err);
    });
};
//function to search omdb
function movieFinder() {
  queryURL = "https://www.omdbapi.com/?t=" + Search + "&y=&plot=short&apikey=trilogy";
  axios.get(queryURL)
    .then(function (response) {

      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Released);
      console.log("IMDB Rating: " + response.data.Ratings[0].Value );
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value );
      console.log("Country/s Produced In: " + response.data.Country);
      console.log("Language: " + response.data.Language );
      console.log("Plot: " + response.data.Plot );
      console.log("Actors: " + response.data.Actors);
     
      //clears search for logging 
      if (Search === "mr nobody") {
        Search = "";
      }
      fs.appendFile("log.txt",
        "\n------\n" +
        "node liri.js " + apiType + " " + Search +
        "\nTitle: " + response.data.Title +
        "\nRelease Year: " + response.data.Released +
        "\nIMDB Rating: " + response.data.Ratings[0].Value +
        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
        "\nCountry/s Produced In: " + response.data.Country +
        "\nLanguage: " + response.data.Language +
        "\nPlot: " + response.data.Plot +
        "\nActors: " + response.data.Actors,
        function (err) {
          if (err) {
            return console.log(err);
          }
        })
      })
        .catch(function (err) {
          console.log(err);
       })
      }
//function to search bandsintown
function bandFinder() {
  queryURL = "https://rest.bandsintown.com/artists/" + Search + "/events?app_id=codingbootcamp";
  axios.get(queryURL)
    .then(function (response) {
      console.log("\n" + Search.toUpperCase() + " has " + response.data.length + " new concert:");
      fs.appendFile("log.txt", "\n-----\n" + "node liri.js " + apiType + " " + Search + "\n" + Search.toUpperCase() + " has " + response.data.length + " new concert:", function(err) {
        if (err) {
          return;
        }
      })
      for (let i = 0; i < response.data.length; i++) {
        console.log(
          "\nVenue: " + response.data[i].venue.name +
          "\nLocation: " + response.data[i].venue.city + "/" + response.data[i].venue.country +
          "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n"
        );
        fs.appendFile("log.txt",
          "\n" +
          "\nVenue: " + response.data[i].venue.name +
          "\nLocation: " + response.data[i].venue.city + "/" + response.data[i].venue.country +
          "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY"), function(err) {
            if (err) {
              return console.log(err);
            } 
        });
      }
    });
};

  
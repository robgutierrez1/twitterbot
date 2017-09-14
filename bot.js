console.log("The Twitter bot is running!");

var Twit = require('twit');
// Code required in order to use twit API

// In order to keep my access keys a secret I put them in a config file
var config = require('./config');

// Check to see if keys are printing in the terminal. If so then config file is being found
//console.log(config);

// Makes a new twit object using the keys stored in config
var T = new Twit(config);

/* The parameters of what you want your bot to search for
var params = {
  q: 'tupac',
  count: 2
}

// From the Twit API with minor changes
T.get('search/tweets', params, function(err, data, response) {
  console.log(data)
})

// What you want your bot to tweet
var my_Tweet = {
  status: 'This is my third Tweet!'
}

//From the Twit API with minor changes
T.post('statuses/update', my_Tweet, function(err, data, response) {
  console.log(data)
})
*/

// Sets up a user stream so that our bot can interact with others
var stream = T.stream('user');

// Will call processing to create a random sketch
var exec = require('child_process').exec;

// Needed to get sketch from processing
var fs = require('fs');

// Occasionally tweet random image. In milliseconds. Every 12 hours
setInterval(tweetPic, 1000*60*60*12);

function tweetPic() {
  var cmd = 'processing-java --sketch=`pwd`/sketch --run';
  exec(cmd, processing);
// Actual function that calls processing
  function processing() {
    // Name of the sketch
    var filename = 'sketch/output.png';
    var parameter = {
      encoding: 'base64'
    }
    // Info to pass on to twitter api
    var b64content = fs.readFileSync(filename, parameter);
    console.log('I have finished');

    // Upload image to twitter but not tweet it
    T.post('media/upload', { media_data: b64content }, uploaded);

    // Actually tweet the image
    function uploaded(err, data, response) {
      var id = data.media_id_string;
      var picTweet = {
        status: 'Here is a picture I drew! Yay!',
        media_ids: [id]
      }
      T.post('statuses/update', picTweet, picFunc);

      // Function for T.post. Checks for error
      function picFunc(err, data, response) {
        if(err) {
          console.log("Unable to tweet image!");
        } else {
          console.log("Image succesfully tweeted!");
        }
      }
    }
  }
}

// Detects when somebody follows your bot
stream.on('follow', followed);

// Function that gets the name of your bot's most recent follower
function followed(eventMsg) {
  console.log("Somebody followed me!")
  var currentName = eventMsg.source.name;
  var userName = eventMsg.source.screen_name;
  tweetReply('Yay! I made a new friend! Thank you for following me @' + userName);
}

// The actual function that will reply to your recent followers
function tweetReply(txt) {
  var myReply = {
    status: txt
  }

  T.post('statuses/update', myReply, replyFunction);

  // Function for my reply post. Checks and see if there is an error
  function replyFunction(err, data, response) {
    if(err) {
      console.log("Unable to to post reply!");
    } else {
      console.log("Reply posted!");
    }
  }
}

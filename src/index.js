$(document).ready(function(){
 
  //select some useful jQuery objects from DOM
  var $tweetFeed = $('#tweet-feed')
  var $pauseButton = $('#pause-button')
 // var $allTweetsButton = $('#all-tweets-button');

  //add click events for buttons
  let paused = false;
  $pauseButton.on("click", function(e){
    // if (paused) $pauseButton.attr("value", "pause")
    // else $pauseButton.attr("value", "start")
    paused = !paused;
    displayTweets(streams.home, 25);
  });
 

  displayTweets(streams.home);



  $('.user').on("click", function(e){
    console.log("click")
    let user = $(e.currentTarget).text();
    displayTweets(streams.users[user],25)
  })

  //DISPLAY TWEETS takes a feed and max # of tweets to display, default 15
  function displayTweets(feed, maxTweets = 15) {
    $tweetFeed.html('') //clear the tweet field
    maxTweets = maxTweets > feed.length ? feed.length : maxTweets;
    var index = feed.length - 1;
    for (let i = 0; i < maxTweets; i++ ) {
      var tweet = feed[index];
      var timeStamp = readableDate(tweet.created_at);
      var $tweet = $(`<div class="tweet" style="display:flex; flex-direction:row">
                        @<div class="user">${tweet.user}</div>
                        <div class="time-stamp"> (${timeStamp}) </div>
                        <div class="tweet-message"> ${tweet.message}</div>
                      </div>`);
      $tweet.appendTo($tweetFeed);
      index -= 1;
    }

    ///find a js library for this, man
    function readableDate(date) {
   
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
      return `${months[date.getMonth()]} ${date.getDay()}, ${date.getHours()%12}:${date.getMinutes()} ${date.getHours() < 12 ? "am" : "pm"}`;
  
    }
  


//    CODE I MIGHT USE

  // clock = new Promise((resolve)=>{
  //   setTimeout(()=>{
  //     displayTweets(streams.home);
  //     resolve(1)
  //   }, 3000)
  // })

  // clock.then(()=>{
  //   setTimeout(()=>{
  //     displayTweets(streams.home);
  //   }, 3000)
  // })

  // while (!paused) {

    // while(index >= 0){
    //   var tweet = feed[index];
    //   var $tweet = $('<div></div>');
    //   $tweet.text('@' + tweet.user + ': ' + tweet.message);
    //   $tweet.appendTo($tweetFeed);
    //   index -= 1;
    // }

  }


  

// var index = streams.home.length - 1;
//     while(index >= 0){
//       var tweet = streams.home[index];
//       var $tweet = $('<div></div>');
//       $tweet.text('@' + tweet.user + ': ' + tweet.message);
//       $tweet.appendTo($body);
//       index -= 1;
//     }

});





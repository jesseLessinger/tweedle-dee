$(document).ready(function(){
 
  //select some useful jQuery objects from DOM
  let $tweetFeed = $('#tweet-feed')
  let $pauseButton = $('#pause-button')
  let $allTweetsButton = $('#all-tweets-button');
  let $feedHeader = $('#feed-header')
  let $tweetsPerPageSetting = $('#tweets-per-page');
  let $pageNum = $('#page-number')


  //determines the number of tweets display in a feed
  let maxTweetsUserSetting = $tweetsPerPageSetting.val();  //default comes from HTML input value
  //keeps track of page number to display
  let pageNum = 1;
  //keeps track of the current feed, for refresh purposes
  let currentFeed = streams.home;



  //****  CLICK EVENTS FOR BUTTONS 

  //refresh button (later to start/start)
  let paused = false;
  $pauseButton.on("click", function(e){
    // if (paused) $pauseButton.attr("value", "pause")
    // else $pauseButton.attr("value", "start")
    paused = !paused;
    renderTweets(currentFeed, maxTweetsUserSetting);
  });
 
  //home feed button
  $allTweetsButton.on("click", function(){
    $feedHeader.text('Home')
    currentFeed = streams.home;
    renderTweets(currentFeed, maxTweetsUserSetting)
  })

  //tweets per page button
  $tweetsPerPageSetting.on("keyup", function(){
    maxTweetsUserSetting = $tweetsPerPageSetting.val();
    renderTweets(currentFeed, maxTweetsUserSetting);
  })

  //change page number
  $pageNum.on("keyup", function(){
    pageNum = $pageNum.val();
    if (pageNum) renderTweets(currentFeed, maxTweetsUserSetting);
  })



  // RENDER all tweets for initial page load
  renderTweets(streams.home, maxTweetsUserSetting);




  //  *********** HELPER FUNCTIONS  **********
  

  //DISPLAY TWEETS takes a feed and max # of tweets to display, default 15
  function renderTweets(feed, maxTweets = 15) {
    //$tweetFeed.html('') //clear the tweet field
    $('.tweet').remove();
    let index = feed.length - 1 - ((pageNum-1) * maxTweets) //start at latest tweet in current page
    console.log(index)
    maxTweets = maxTweets > index + 1 ? index + 1 : maxTweets;
    //let index = (feed.length - 1);
    for (let i = 0; i < maxTweets; i++ ) {
      let tweet = feed[index];
      let timeStamp = readableDate(tweet.created_at);
      let $tweet = $(`<div class="tweet" style="display:flex; flex-direction:row">                     
                        <div class="user">@${tweet.user}</div>
                        <div class="time-stamp"> (${timeStamp}) </div>
                        <div class="tweet-message"> ${tweet.message}</div>
                      </div>`);
      
      //add a click function to display the users tweets
      $tweet.on("click", function(){
        $feedHeader.text(tweet.user)
        currentFeed = streams.users[tweet.user];
        renderTweets(streams.users[tweet.user], maxTweetsUserSetting);
      })
      
      $tweet.appendTo($tweetFeed);
      index -= 1;
    }
    

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

 


  

// var index = streams.home.length - 1;
//     while(index >= 0){
//       var tweet = streams.home[index];
//       var $tweet = $('<div></div>');
//       $tweet.text('@' + tweet.user + ': ' + tweet.message);
//       $tweet.appendTo($body);
//       index -= 1;
//     }

});





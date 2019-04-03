$(document).ready(function(){
 
  //select some useful jQuery objects from DOM
  let $tweetFeed = $('#tweet-feed')
  let $pauseButton = $('#pause-button')
  let $allTweetsButton = $('#all-tweets-button');
  let $feedHeaderTitle = $('#feed-header-title');
  let $tweetsPerPageSetting = $('#tweets-per-page');
  let $pageNum = $('#page-number');
  let $prevPage = $('#prev-page').attr('disabled', true);
  let $nextPage = $('#next-page');


  //determines the number of tweets display in a feed
  let maxTweetsUserSetting = 6;
  $tweetsPerPageSetting.val(maxTweetsUserSetting);  
  //keeps track of page number to display
  let pageNum = 1;
  //keeps track of the current feed, for refresh purposes
  let currentFeed = streams.home;



  //****  CLICK EVENTS FOR BUTTONS 

  //refresh button (later to start/start)
  //let paused = false;
  $pauseButton.on("click", function(e){
    // if (paused) $pauseButton.attr("value", "pause")
    // else $pauseButton.attr("value", "start")
    //paused = !paused;
    renderTweets(currentFeed, maxTweetsUserSetting);
  });
 
  //home feed button
  $allTweetsButton.on("click", function(){
   $feedHeaderTitle.text('')
    currentFeed = streams.home;
    pageNum = 1; $pageNum.text(pageNum);
    renderTweets(currentFeed, maxTweetsUserSetting)
  })

  //tweets per page button
  $tweetsPerPageSetting.on("keyup", function(){
    maxTweetsUserSetting = $tweetsPerPageSetting.val();
    pageNum = 1; $pageNum.text(pageNum);
    renderTweets(currentFeed, maxTweetsUserSetting);
  })

  //change pages w/ next and prev buttons
  $nextPage.on("click", function() {
    $pageNum.text(++pageNum)
    if (pageNum) renderTweets(currentFeed, maxTweetsUserSetting);
  });

  $prevPage.on("click", function() {
    $pageNum.text(--pageNum)
    if (pageNum) renderTweets(currentFeed, maxTweetsUserSetting);
  });



  // ****** RENDER **** all tweets for initial page load
  renderTweets(streams.home, maxTweetsUserSetting);




  //  *********** HELPER FUNCTIONS  **********
  

  // RENDER TWEETS 
  //takes a feed and max # of tweets to display, default 15
  function renderTweets(feed, maxTweets = 15) {
    //make sure tweet contain is correct size
    $tweetFeed.css('min-height', (maxTweets * 40) +"px")  //px for each tweet
    //start at latest tweet in current page
    let index = feed.length - 1 - ((pageNum-1) * maxTweets) 

    //test if it's the last page
    if (maxTweets > index + 1) {
      maxTweets = index + 1;
      $nextPage.attr('disabled', true);
    } else { 
      $nextPage.attr('disabled', false);;
    }

    //test if for first page
    if (index === feed.length - 1) {
      $prevPage.attr('disabled', true);
    } else {
      $prevPage.attr('disabled', false);;
    }
    
    //remove some tweets
    if (index > 0) $('.tweet').remove(); 

    //CREATE NEW TWEET ELEMENTS
    for (let i = 0; i < maxTweets; i++ ) {
      let tweet = feed[index];
      let timeStamp = relativeDate(tweet.created_at);     
      let $tweet = $(`<div class="tweet">                     
                        <div class="tweet-message"> ${tweet.message}</div>
                      </div>`);
      let $tweetHeader = $(`<div class="tweet-header"> 
                      <div class="user">@${tweet.user}</div>
                      <div class="time-stamp"> ${timeStamp} </div>
                    </div>`).prependTo($tweet);
                  
      
      //add a click function to display the users tweets
      $tweetHeader.on("click", function(){
        $feedHeaderTitle.text(tweet.user)
        currentFeed = streams.users[tweet.user];
        pageNum = 1; $pageNum.text(pageNum);
        renderTweets(streams.users[tweet.user], maxTweetsUserSetting);
      })
      
      $tweet.appendTo($tweetFeed);
      index -= 1;
    }

  }

    ///find a js library for this, man
  function relativeDate(tweetDate) {
    let tweetSec = tweetDate.getSeconds();
    let tweetMin = tweetDate.getMinutes();
    let tweetHrs = tweetDate.getHours();

    let date = new Date(Date.now());
    let sec = date.getSeconds();
    let min = date.getMinutes();
    let hrs = date.getHours(); 
   
    if (tweetDate.getDay() === date.getDay()) {
      if (hrs > tweetHrs) return (hrs - tweetHrs) + " hrs ago";

      if (min > tweetMin) return (min - tweetMin) + " min ago";

      return "seconds ago";
      
    }

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[tweetDate.getMonth()]} ${tweetDate.getDay()}, ${tweetHrs % 12}:${tweetMin} ${tweetHrs < 12 ? "am" : "pm"}`;

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





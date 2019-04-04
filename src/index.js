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
  let $newMessage = $('#new-tweet-message');
  let $postMessageButton = $('#post-message-button');
  let $newUserContainer = $('#new-user-container');
  let $newTweetContainer = $('#new-tweet-container').hide();
  let $newUserButton = $('#add-user-button')
  let $newUser = $('#new-user')
  let $headerAvatarContainer =  $('#header-avatar-container').hide();

  //add some avatar images
  streams.users.images = {};
  let avatars = streams.users.images;
  users.forEach(function(userName){
    avatars[userName] = `images/avatars/${Math.floor(Math.random()*5)}.jpg`;
  })
  
  //new user 
  let newUser = "guest_user";

  //determines the number of tweets display in a feed
  let maxTweetsUserSetting = 6;
  $tweetsPerPageSetting.val(maxTweetsUserSetting);  
  //keeps track of page number to display
  let pageNum = 1;
  //keeps track of the current feed, for refresh purposes
  let currentFeed = streams.home;



  //****  CLICK EVENTS FOR BUTTONS  *****

  //post message button
  $postMessageButton.on("click", function(){
    let newTweet = {
      user: newUser,
      message: $newMessage.val(),
      created_at: new Date()
    }
    streams.home.push(newTweet);
    streams.users[newUser].push(newTweet);
    $newMessage.val('');
    renderTweets(currentFeed, maxTweetsUserSetting);
  })

  $newMessage.on("keyup", function(key){
    if (key.which === 13) $postMessageButton.click(); //enter key pressed
  })

  //register new user botton
  $newUserButton.on("click", function(){
    newUser = $newUser.val();
    streams.users[newUser] = [];
    $newMessage.attr('placeholder', `what's on your mind, ${newUser}?`)
    $newUserContainer.hide();
    $(`<div id="user">@${newUser}</div>`).hide().prependTo($('#main-contents')).fadeIn(1000);
    $newTweetContainer.fadeIn(1000);
  })

  $newUser.on("keyup", function(key){
    if (key.which === 13) $newUserButton.click(); //enter key pressed
  })


  //pause/start button
  $pauseButton.on("click", function(){
    if ($pauseButton.val() === "pause") $pauseButton.val("start")
    else $pauseButton.val("pause");
    renderTweets(currentFeed, maxTweetsUserSetting);
  });
 
  //home feed button
  $allTweetsButton.on("click", function(){
    //$feedHeaderTitle.text('')
    $headerAvatarContainer.hide();
    currentFeed = streams.home;
    pageNum = 1; $pageNum.text(pageNum);
    renderTweets(currentFeed, maxTweetsUserSetting, 500)
  })

  //tweets per page setting input
  $tweetsPerPageSetting.on("keyup", function(key){
    if (key.which === 13) {
      maxTweetsUserSetting = $tweetsPerPageSetting.val();
      pageNum = 1; $pageNum.text(pageNum);
      renderTweets(currentFeed, maxTweetsUserSetting);
    }
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



  

  // ****** REFRESH TWEET FEED **** 
  //refeshes automatically every second

  var refreshTweets = function(){
    if ($pauseButton.val() === "pause") renderTweets(currentFeed, maxTweetsUserSetting);
    setTimeout(refreshTweets, 1000);
  };
  refreshTweets();





  //  *********** HELPER FUNCTIONS  **********
  

  // RENDER TWEETS 
  //takes a feed and max # of tweets to display, default 15
  //@fadeInDelay - milliseconds to fade feed in, default no fade
  function renderTweets(feed, maxTweets = 15, fadeInDelay) {
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

    if (fadeInDelay) $tweetFeed.hide();
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
                  
      
      //display @users feed - click function
      $tweetHeader.on("click", function(){
        //change/display user name and avatar
        $feedHeaderTitle.text("@"+tweet.user)
        $('#header-avatar').attr('src', avatars[tweet.user])
        $headerAvatarContainer.hide().fadeIn(fadeInDelay);
        //update feed, reset pageNum to 1, render feed
        currentFeed = streams.users[tweet.user];
        pageNum = 1; $pageNum.text(pageNum);
        renderTweets(currentFeed, maxTweetsUserSetting, 500);
      })
      

      $tweet.appendTo($tweetFeed);
      index -= 1;
    }

    if (fadeInDelay) $tweetFeed.fadeIn(fadeInDelay);

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

      return "just now";
      
    }

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[tweetDate.getMonth()]} ${tweetDate.getDay()}, ${tweetHrs % 12}:${tweetMin} ${tweetHrs < 12 ? "am" : "pm"}`;

  }
  
});





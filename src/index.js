$(document).ready(function(){
 
  //select some useful jQuery objects from DOM
  let $tweetFeed = $('#tweet-feed')
  let $pauseButton = $('#pause-button') 
  let $homeButton = $('.home-button');
  let $feedHeaderTitle = $('#feed-header-title');
  let $tweetsPerPageSetting = $('#tweets-per-page');
  let $pageNum = $('#page-number');
  let $prevPage = $('#prev-page').attr('disabled', true);
  let $nextPage = $('#next-page');
  let $newMessage = $('#new-tweet-message');
  let $postMessageButton = $('#post-message-button');
  let $newUserContainer = $('#new-user-container');
  let $newUserButton = $('#add-user-button')
  let $newUser = $('#new-user')
  let $headerAvatarContainer =  $('#header-avatar-container').hide();
  let $userSection = $('#user-section').hide();
  let $tweetFeedContainer = $('#tweet-feed-container').hide();
  let $selectAvatarContainer = $('#select-avatar-container')

  //add some avatar images
  streams.users.images = {};
  let avatars = streams.users.images;
  users.forEach(function(userName){
    avatars[userName] = randomAvatar();
  })

  //set up tags streams - this should really be in data_generator.js
  streams.tags = {};
  
  //new user 
  let newUser = "guest_user";

  //determines the number of tweets display in a feed
  let maxTweetsUserSetting = 6;
  $tweetsPerPageSetting.val(maxTweetsUserSetting);  
  //keeps track of page number to display
  let pageNum = 1;
  //keeps track of the current feed, for refresh purposes
  let currentFeed = streams.home;

  streams.home.cachedLength = streams.home.length;
  

  //add avatar selection
  // let avIcons = [];
  // for(let i = 0; i < 6; i++) {
  //   avatarURLs.push(`images/avatars/${i}.jpg`)
  // }

  // avatarsURLs.forEach(url => {
  //   $selectAvatarContainer.append()
  // })

  //****  CLICK EVENTS FOR BUTTONS  *****

  //register new user botton
  $newUserButton.on("click", function(){
    newUser = $newUser.val();
    if (newUser.length === 0) { //check if something was actually entered
      $newUser.attr('placeholder', "that's not a name");
      return;
    }
    $newUserContainer.hide();
    //set up new user stream, avatar, and clickable header 
    streams.users[newUser] = [];
    avatars[newUser] = randomAvatar();
    $('#user-section-avatar').attr('src', avatars[newUser])
    $newMessage.attr('placeholder', `what's on your mind, ${newUser}?`)
    $(`<div id="user">@${newUser}</div>`)
      .on("click", function(){
        $headerAvatarContainer.hide();
        changeFeed(streams.users[newUser]);
      }).prependTo($('#user-and-home-container'));

    $userSection.fadeIn(1000);
    $tweetFeedContainer.slideDown(1000);
  })

  $newUser.on("keyup", function(key){
    if (key.which === 13) $newUserButton.click(); //enter key pressed
  })

  //post message button
  $postMessageButton.on("click", function(){
    let newTweet = {
      user: newUser,
      message: $newMessage.val().trim(),
      created_at: new Date()
    }
    streams.home.push(newTweet);
    streams.users[newUser].push(newTweet);
    $newMessage.val('');
    renderTweets(currentFeed, maxTweetsUserSetting, 0, "update");
  })

  $newMessage.on("keyup", function(key){
    if (key.which === 13) $postMessageButton.click(); //enter key pressed
  })



  //pause/start button
  $pauseButton.on("click", function(){
    if ($pauseButton.val() === "pause") $pauseButton.val("start")
    else {
      $pauseButton.val("pause");
      pageNum = 1; $pageNum.text(pageNum);
    }
    //renderTweets(currentFeed, maxTweetsUserSetting);
  });
 
  //home feed button
  $homeButton.on("click", function(){
    $headerAvatarContainer.hide();
    changeFeed(streams.home);
  })


  //tweets per page setting input
  $tweetsPerPageSetting.on("keyup", function(key){
    if (key.which === 13) {
      maxTweetsUserSetting = $tweetsPerPageSetting.val();
      pageNum = 1; $pageNum.text(pageNum);
      renderTweets(currentFeed, maxTweetsUserSetting, 300);
    }
  })

  //change pages w/ next and prev buttons
  $nextPage.on("click", function() {
    $pageNum.text(++pageNum)
    if (pageNum) renderTweets(currentFeed, maxTweetsUserSetting, 300);
  });

  $prevPage.on("click", function() {
    $pageNum.text(--pageNum)
    if (pageNum) renderTweets(currentFeed, maxTweetsUserSetting, 300);
  });



  // ****** REFRESH TWEET FEED **** 
  //refeshes automatically every second

  var refreshTweets = function(){
    if ($pauseButton.val() === "pause") renderTweets(currentFeed, maxTweetsUserSetting, 0, "update");
    setTimeout(refreshTweets, 1000);
  };
  refreshTweets();
    

  // *****  UPDATE TAGS FEED  ******
  var updateTags = function() {
    streams.home.forEach(tweet => {
      getTags(tweet.message).forEach( tag => {
        streams.tags[tag] = streams.tags[tag] || [];
        let tagStream = streams.tags[tag];
        if (tagStream.indexOf(tweet) === -1) tagStream.push(tweet);
      }) 
    })
    setTimeout(updateTags, 1000);
  }
  updateTags();




  //  *********** HELPER FUNCTIONS  **********
  
  //when a feed changes: update current feed, reset page number to 1, and render tweets
  function changeFeed(feed) {
      currentFeed = feed;
      pageNum = 1; $pageNum.text(pageNum);
      renderTweets(currentFeed, maxTweetsUserSetting, 500);
  }

  // RENDER TWEETS 
  //takes a feed and max # of tweets to display,
  //@fadeInDelay - milliseconds to fade feed in, default no fade
  function renderTweets(feed, maxTweets = 8, fadeDelay, update) {
    //start at latest tweet in current page
    
    //let start by just re-render from the previous point
    feed.cachedLength = feed.cachedLength || feed.length; //initialize cache if undefined
    let numNewTweets = feed.length - feed.cachedLength; 

    if (update) {
      if (numNewTweets === 0)  return;
      maxTweets = numNewTweets > 0 ? numNewTweets: maxTweets;
      var $lastTweet = $tweetFeed.children().last();
    }
    else $('.tweet').remove(); //remove all tweets

    //slice out only the tweets we want to display

    let endIndex = feed.length - ((pageNum-1) * maxTweets)

    //test if it's the last page
    if (maxTweets > endIndex) {
      maxTweets = endIndex;
      $nextPage.attr('disabled', true);
    } else { 
      $nextPage.attr('disabled', false);;
    }

    let startIndex = endIndex - maxTweets; 

    let feedSlice = feed.slice(startIndex, endIndex)

    //test if for first page
    if (pageNum === 1) { // (index === feed.length - 1) {
      $prevPage.attr('disabled', true);
    } else {
      $prevPage.attr('disabled', false);;
    }
    
    if (maxTweets < 1) $('<div class="tweet non-tweet">no tweets yet...</div>').appendTo($tweetFeed)


    if (fadeDelay) $tweetFeed.hide()//fadeOut(fadeDelay);
    //CREATE NEW TWEET ELEMENTS
    
    
   
   
    
    feedSlice.forEach( tweet => {
      //build tweet element, avatar, user name, timestamp, message w/tags
      let wrappedMessage = wrapTags(tweet.message);
      let timeStamp = relativeDate(tweet.created_at);     
      let $tweet = 
        $(`<div class="tweet">                     
          <div class="tweet-message"> ${wrappedMessage}</div>
        </div>`);
      let $tweetHeader = 
        $(`<div class="tweet-header"> 
            <img class="tweet-avatar" src="${avatars[tweet.user]}" />
            <div class="user">@${tweet.user}</div>
            <div class="time-stamp"> ${timeStamp} </div>
        </div>`).prependTo($tweet);          

      //display @users feed - click function
      $tweetHeader.on("click", function(){
        changeHeader("@"+tweet.user, avatars[tweet.user])
        changeFeed(streams.users[tweet.user]);
      })
      
      if (update) {
        $tweet.hide().prependTo($tweetFeed).slideDown(1000);
        if ($tweetFeed.children().length > maxTweetsUserSetting) {
          $tweetFeed.children().last().prependTo('#tweet-feed-trash-collector').slideUp(1000);
        }
        // $lastTweet.slideUp(1000, function() { $(this).remove() })
        // $lastTweet = $lastTweet.prev();
      } else {
        $tweet.prependTo($tweetFeed);
      }
      
      //remove extra tweets
      console.log($tweetFeed.children().length)

    })

    //update cache length - refers to previous feed length
    feed.cachedLength = feed.length;

    //display tag - click function
    $('.tag').on("click", function(e){
      let tagName = $(e.currentTarget).text();
      changeHeader(tagName);
      changeFeed(streams.tags[tagName]);
    });

    //fade in the feed
    if (fadeDelay) $tweetFeed.fadeIn(fadeDelay);

  }


  //change header
  function changeHeader(header, avatar) {
    $feedHeaderTitle.text(header)
    if (avatar) $('#header-avatar').show().attr('src', avatar)
    else $('#header-avatar').hide();
    $headerAvatarContainer.hide().fadeIn(500);
  }

  //randomAvatar generator
  function randomAvatar() {
    return `images/avatars/${Math.floor(Math.random()*6)}.jpg`;
  }

  //returns a string with all #tags wrapped in div
  function wrapTags(message) {  
    return message.split(" ").map((str)=>{
      return str[0] === '#' ? `<div class="tag">${str}</div>` : str; 
    }).join(" ");
  }
  
  //return an array of tags in a mesage
  function getTags(message) {
    return message.match(/\#[a-z]*/g) || [];
  }

  
  function relativeDate(tweetDate) {

    return tweetDate.getDay() === (new Date()).getDay() ? moment(tweetDate).fromNow()
        : moment().format('MMM Do h:mm a');

  }

    // let tweetSec = tweetDate.getSeconds();
    // let tweetMin = tweetDate.getMinutes();
    // let tweetHrs = tweetDate.getHours();

    // let date = new Date(Date.now());
    // let sec = date.getSeconds();
    // let min = date.getMinutes();
    // let hrs = date.getHours(); 
   
    // if (tweetDate.getDay() === date.getDay()) {
    //   if (hrs > tweetHrs) retweet.hide().prependTo($tweetFeed).slideDown(1000);
        // $turn (hrs - tweetHrs) + " hrs ago";

    //   if (min > tweetMin) return (min - tweetMin) + " min ago";

    //   return "just now";
      
    // }

    // let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // return `${months[tweetDate.getMonth()]} ${tweetDate.getDay()}, ${tweetHrs % 12}:${tweetMin} ${tweetHrs < 12 ? "am" : "pm"}`;

 
  
});





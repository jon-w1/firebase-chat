//STEP 1
var ref = new Firebase("https://exampleapp1.firebaseio.com/demo2");
var messagesRef = ref.child('messages');
var usersRef = ref.child('users');
var currentUser = null;

//STEP 2
  $('#login').on("click", function () {
    authenticate();
  });

//STEP 3
var authenticate = function() {
  usersRef.authWithOAuthPopup('twitter', function (error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      usersRef.child(user.uid).set({username: user.twitter.username, pic: user.twitter.cachedUserProfile.profile_image_url_https});
      currentUser = user;
    }
  });
};
//Save user's auth state
usersRef.onAuth(function (user) {
  currentUser = user;
});

//STEP 4: Display a list of users who have logged in
usersRef.on('child_added', function (snapshot) {
  var user = snapshot.val();
  $("<div class='user'><img src=" + user.pic + "/><span class='username'>@" + user.username + "</span></div>").appendTo($('#here'));
});

//STEP 5: Store messages in Firebase
$('#tweet-submit').on('click', function () {
  if (currentUser !== null) {
    var message = $('#msgInput').val();
    //Send the message to Firebase
    messagesRef.push({user: currentUser.uid, username: currentUser.twitter.username, message: message});
    $('#msgInput').val('');
  } else {
    alert('You must login with Twitter to post!');
  }
});

//STEP 6: Add messages to DOM in realtime
messagesRef.on('child_added', function (snapshot) {
  var message = snapshot.val();
    $('#stream').append($("<div class='msg-text'>").text(message.username).append('<br/>').append($('<span/>').text(message.message)));
});
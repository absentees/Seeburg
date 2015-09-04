Template.roomList.helpers({
  'room': function() {
    return Rooms.find({}, {
      sort: {
        name: 1
      }
    });
  }
});

Template.roomItem.events({
  'click .deleteRoom': function() {
    console.log('delete');
    event.preventDefault();
    var roomId = this._id;
    $('.deleteRoom').text("click again to delete");
    var confirm = false;
    if (confirm) {
      Meteor.call("deleteRoom", roomId, function(error, result) {
        if (error) {
          console.log("error", error);
        }
      });
    }
  },
  'click .cancel': function() {
    event.preventDefault();
    $('.cancel').hide();
  }
});

Template.home.onRendered(function() {
  var validator = $('.request').validate({
    submitHandler: function(event) {
      var recipientAddress = $('[name=email]').val();
      Meteor.call('requestInvite', recipientAddress, function(err, data) {
        if (err) {
          validator.showErrors({
            email: err.reason
          });
        } else {
          Router.go("thanks");
        }
      });
    }
  })
});

Template.home.events({
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.navigation.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.login.onRendered(function() {
  var validator = $('.login').validate({
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    },
    submitHandler: function(event) {
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log(err.reason);
          if (err.reason == "User not found") {
            validator.showErrors({
              email: "that email does not exist to a registered user."
            })
          }
          if (err.reason == "Incorrect password") {
            validator.showErrors({
              password: "you entered an incorrect password."
            })
          }
        } else {
          var currentRoute = Router.current().route.getName();
          console.log(currentRoute);
          if (currentRoute == "login") {
            Router.go("home");
          }
        }
      })
    }
  })
});


Template.newRoomPage.events({
  'submit form': function(event) {
    event.preventDefault();
    var roomName = $('[name=roomName]').val();
    Meteor.call('createNewRoom', roomName, function(err, data) {
      Router.go('/room/' + data);
    });
  }
});

Template.roomPage.events({
  "keyup [name=newTrackName]": function(event) {
    var searchQuery = $(event.target).val();
    if (searchQuery == "") {
      Session.set('searchResults', []);
    } else {
      HTTP.get("https://api.soundcloud.com/tracks?client_id=7a50c29ed854bb6bf4a2aea13b640eed", {
          params: {
            q: searchQuery
          }
        },
        function(error, result) {
          if (!error) {
            Session.set("searchResults", result.data);
          } else {
            Session.set("searchResults", []);
          }
        });
    }

  },
  "click .searchResult": function(event) {
    console.log('submit');
    var trackName = $(event.target).text();
    var trackArtist = "Track Artist";
    var trackURL = "http://soundcloud.com/";
    var roomId = Session.get('roomId');

    Meteor.call('addNewTrack', trackName, trackArtist, trackURL, roomId, function(err,data){
      if (err) {
        Session.set('errorMessage', err.reason)
      }
    });
  },
  "click .deleteQueuedTrack": function(event){
    var trackName = $(event.target).text();
    console.log("delete track click: " + trackName);
  }
});

Template.roomPage.helpers({
  searchResults: function() {
    return Session.get('searchResults');
  },
  errorMessage: function(){
    return "";
  }
});

Template.roomPage.onRendered(function(){
  var roomId = this.data._id;
  Session.set('roomId', roomId);
});

Template.roomPage.onDestroyed(function(){
  Session.set('searchResults', []);
});



$.validator.setDefaults({
  rules: {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true
    }
  },
  messages: {
    email: {
      required: "you must enter an email address",
      email: "you have entered an invalid email"
    },
    password: {
      required: "you must enter a password.",
      minlength: "your password must be at least {0} characters."
    }
  }

});

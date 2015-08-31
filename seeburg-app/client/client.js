Template.roomList.helpers({
  'room': function() {
    return Rooms.find({},{sort: { name: 1 }});
  }
});

Template.home.onCreated(function() {
  this.subscribe('rooms');
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
          var currentRouter = Router.current().route.getName();
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
    var roomId = Meteor.call('createNewRoom', roomName);
    Router.go('/room/' + roomId);
  }
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

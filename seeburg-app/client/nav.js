Template.headerBar.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  },
  'click .login': function(event){
    event.preventDefault();
    $('.login-register-form').toggleClass('-active');
    $('.header-bar').toggleClass('-active');
  },
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.headerBar.onRendered(function()   {
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

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

$.validator.setDefaults({
  rules: {
    email: {
      required: true,
      email: true
    }
  },
  messages: {
    email: {
      required: "you must enter an email address",
      email: "you have entered an invalid email"
    }
  }
});

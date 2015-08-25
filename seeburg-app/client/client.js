Template.home.events({
  'submit form': function(event){
    event.preventDefault();
    var recipientAddress = $('[name=email]').val();
    Meteor.call('requestInvite', recipientAddress);
  }
})

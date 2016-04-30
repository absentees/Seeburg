Template.loginRegister.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  },
  'click .login': function(event){
    event.preventDefault();
    $('.loginRegisterForm').toggleClass('-active');
    $('.header-bar').toggleClass('-active');
  }
});

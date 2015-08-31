Invites = new Meteor.Collection('invites');
Rooms = new Meteor.Collection('rooms');
//Tracks = new Meteor.Collection('tracks');

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/thanks');
Router.route('/login');
Router.route('/register');
Router.route('/room/new', {
  name: 'newRoomPage',
  template: 'newRoomPage'
});
Router.route('/room/:_id',{
  name: 'roomPage',
  template: 'roomPage',
  data: function(){
    var currentRoom = this.params._id;
    return Rooms.findOne({
      _id: currentRoom
    });
  },
  waitOn: function(){
    return Meteor.subscribe("rooms");
  }
});

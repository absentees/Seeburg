Invites = new Meteor.Collection('invites');
Rooms = new Meteor.Collection('rooms');
//Tracks = new Meteor.Collection('tracks');

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', {
  name: 'home',
  template: 'home',
  waitOn: function(){
    var currentUser = Meteor.userId();
    if (currentUser) {
      return Meteor.subscribe("rooms", currentUser);
    } else {
      return false;
    }
  }
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
    var allRooms = Meteor.subscribe("rooms","");
    return allRooms;
  }
});

Invites = new Meteor.Collection('invites');
//Rooms = new Meteor.Collection('rooms');
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


if(Meteor.isClient){
    // this code only runs on the client
    console.log("Hello client");

    Template.roomList.helpers({
      'room': function(){
        return RoomsList.find();
      },
      'listener': function(){
        return "listener here";
      }
    });
}

if(Meteor.isServer){
    // this code only runs on the server
    console.log("Hello server");

}

RoomsList = new Mongo.Collection('rooms');

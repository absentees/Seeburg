if(Meteor.isClient){
    // this code only runs on the client
    console.log("Hello client");

    Template.roomList.helpers({
      'room': function(){
        return RoomsList.find({}, { sort: { likes: -1, title: 1 } });
      },
      'listener': function(){
        return "listener here";
      },
      'selectedClass': function(){
        var roomId = this._id;
        var selectedRoom = Session.get('selectedRoom');
        if(roomId == selectedRoom){
          return "selected";
        }
      },
      'showSelectedRoom': function(){
        var selectedRoom = Session.get('selectedRoom');
        return RoomsList.findOne(selectedRoom);
      }
    });

    Template.roomList.events({
      'click .roomItem': function(){
        var roomId = this._id;
        Session.set('selectedRoom', roomId);
      },
      'click .like': function(){
        var selectedRoom = Session.get('selectedRoom');
        RoomsList.update(selectedRoom, { $inc: { likes: 1 } });
      },
      'click .unlike': function(){
        var selectedRoom = Session.get('selectedRoom');
        RoomsList.update(selectedRoom, { $inc: { likes: -1 } });
      },
      'click .remove': function(){
        var selectedRoom = Session.get('selectedRoom');
        RoomsList.remove(selectedRoom);
      }
    });

    Template.addRoomForm.events({
      'submit form': function(event){
        event.preventDefault();
        var roomTitleVar = event.target.roomTitle.value;
        var newRoomId = RoomsList.insert({
          title: roomTitleVar,
          likes: 0
        });
        event.target.roomTitle.value = "";
        Session.set('selectedRoom', newRoomId);
      }
    });
}

if(Meteor.isServer){
    // this code only runs on the server
    //console.log("Hello server");

}

RoomsList = new Mongo.Collection('rooms');

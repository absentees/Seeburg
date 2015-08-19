
    // this code only runs on the client
    Meteor.subscribe('theRooms');

    Template.roomList.helpers({
      'room': function(){
        var currentUserId = Meteor.userId();
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
        Meteor.call('modifyRoomLikes', selectedRoom, 1);
      },
      'click .unlike': function(){
        var selectedRoom = Session.get('selectedRoom');
        Meteor.call('modifyRoomLikes', selectedRoom, -1);
      },
      'click .remove': function(){
        var selectedRoom = Session.get('selectedRoom');
        Meteor.call('removeRoomData', selectedRoom);
      }
    });

    Template.addRoomForm.events({
      'submit form': function(event){
        event.preventDefault();
        var roomTitleVar = event.target.roomTitle.value;
        event.target.roomTitle.value = "";
        Meteor.call('insertRoomData', roomTitleVar);
      }
    });

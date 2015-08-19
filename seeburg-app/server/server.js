
    // this code only runs on the server
    Meteor.publish('theRooms',function(){
      var currentUserId = this.userId;
      return RoomsList.find({
        createdBy: currentUserId
      });
    });

    Meteor.methods({
      'insertRoomData': function(roomTitleVar){
        var currentUserId = Meteor.userId();
        RoomsList.insert({
          title: roomTitleVar,
          likes: 0,
          createdBy: currentUserId
        });
      },
      'removeRoomData': function(selectedRoom){
        var currentUserId = Meteor.userId();
        RoomsList.remove({ _id: selectedRoom, createdBy: currentUserId });
      },
      'modifyRoomLikes': function(selectedRoom, likeValue){
        var currentUserId = Meteor.userId();
        RoomsList.update({ _id: selectedRoom, createdBy: currentUserId }, {$inc: {likes: likeValue} });
      }
    });

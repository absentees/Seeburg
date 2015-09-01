Meteor.methods({
  'requestInvite': function(recipientEmail) {
    this.unblock();
    var inviteCode = Meteor.hashid();

    var existingUser = Invites.find({
      email: recipientEmail
    }).count();
    console.log(existingUser);
    if (existingUser > 0) {
      throw new Meteor.Error("already-exists", "email address has already requested invite code");
    }

    Email.send({
      from: "noreply@seeburg.website",
      to: recipientEmail,
      subject: "*********\n your seeburg invite code \n**************",
      text: "*********************\nseeburg-app\n**********************\n\nthank you for your interest in seeburg.\nkeep this invite code handy and we will email you again when closed beta begins: " + inviteCode + "\n\nthe seeburg team."
    });
    Invites.insert({
      email: recipientEmail,
      sentcode: true,
      code: inviteCode
    }, function(error, result) {
      if (error) {
        return error;
      } else {
        console.log(result);
        console.log(Invites.find().fetch());
      }
    });
  },
  'createNewRoom': function(roomName) {
    var currentUser = Meteor.userId();
    if (roomName == "") {
      roomName = "untitled room";
    }
    check(roomName, String);
    var data = {
      name: roomName,
      createdBy: currentUser,
      createdOn: Date.now()
    };
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "you are not logged in.");
    }
    return Rooms.insert(data);
  },
  'addNewTrack': function(trackName, trackArtist, trackURL, roomId){
    var currentUser = Meteor.userId();
    var currentRoom = Rooms.findOne({ _id: roomId });

    console.log('user:' + currentUser);
    console.log('room: ' + currentRoom._id);
    console.log('track: ' + trackName + " " + trackArtist + " " + trackURL);
  }
});

Meteor.publish('rooms', function(currentUser) {
  if (currentUser) {
    return Rooms.find({
      createdBy: currentUser
    });
  } else {
    return Rooms.find({});
  }

});

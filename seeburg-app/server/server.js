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
    if (listName == "") {
      listName = "untitled room";
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
    Rooms.insert(data);
  }
});

Meteor.publish('rooms', function(currentList) {
  var currentUser = this.userId;
  return Rooms.find({
    createdBy: currentUser
  });
});

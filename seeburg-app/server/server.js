Meteor.methods({
  'requestInvite': function(recipientEmail){
    var inviteCode = "asdf123"
    Email.send({
    from: "noreply@seeburg-app.com",
    to: recipientEmail,
    subject: "Your Seeburg invite code",
    text: "Thank you for your interest in Seeburg. Keep this invite code handy and we will email you again when closed beta begins" + inviteCode
    });
  }
})

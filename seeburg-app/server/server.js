var isRoomOwner = function(roomId) {
	var currentRoom = Rooms.findOne({
		_id: roomId
	});

	if (currentRoom.createdBy == Meteor.userId()) {
		return true;
	} else {
		return false;
	}
}

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
			createdOn: Date.now(),
			tracks: [],
			currentlyPlaying: "",
			guestListeners: 0,
			listeners: []
		};
		if (!currentUser) {
			throw new Meteor.Error("not-logged-in", "you are not logged in.");
		}
		return Rooms.insert(data);
	},
	'deleteRoom': function(roomId) {
		if (!isRoomOwner(roomId)) {
			throw new Meteor.Error("operation-not-allowed", "operation not allowed by current user");
		}

		var currentUser = Meteor.userId();
		var data = Rooms.findOne({
			_id: roomId,
			createdBy: currentUser
		});
		if (data) {
			Rooms.remove({
				_id: roomId
			});
		} else {
			throw new Meteor.Error("room-not-found", "room not found.");
		}
	},
	'addNewTrack': function(trackName, trackArtist, trackURL, roomId) {
		var currentUser = Meteor.userId();
		var currentRoom = Rooms.findOne({
			_id: roomId
		});
		var newTrack = {
			_id: Meteor.hashid(),
			name: trackName,
			trackURL: trackURL,
			addedBy: currentUser
		};
		Rooms.update({
			_id: roomId
		}, {
			$addToSet: {
				tracks: newTrack
			}
		}, function(err, data) {
			if (err) {
				console.log(err.reason);
			}
		})
	},
	'deleteTrack': function(trackId, roomId, userId) {
		var currentRoom = Rooms.findOne({
			_id: roomId
		});

		if (!isRoomOwner(roomId)) {
			throw new Meteor.Error("operation-not-allowed", "operation not allowed by current user");
		}

		Rooms.update({
			_id: roomId
		}, {
			$pull: {
				tracks: {
					_id: trackId
				}
			}
		}, function(err, data) {
			if (err) {
				console.log(err.reason);
			}
		});

		if (currentRoom.currentlyPlaying) {
			if (currentRoom.currentlyPlaying._id == trackId) {
				console.log('stop track on delete');
				Meteor.call('stopTrack', roomId);
			}
		}
	},
	'playTrack': function(trackId, roomId) {
		var currentRoom = Rooms.findOne({
			_id: roomId
		});

		if (!isRoomOwner(roomId)) {
			throw new Meteor.Error("operation-not-allowed", "operation not allowed by current user");
		}
		var trackToPlay;
		for (var i = 0; i < currentRoom.tracks.length; i++) {
			if (currentRoom.tracks[i]._id == trackId) {
				trackToPlay = currentRoom.tracks[i];
			}
		}

		if (trackToPlay != null) {
			Rooms.update({
				_id: roomId
			}, {
				$set: {
					currentlyPlaying: trackToPlay
				}
			});
		}


	},
	'stopTrack': function(roomId) {
		if (!isRoomOwner(roomId)) {
			throw new Meteor.Error("operation-not-allowed", "operation not allowed by current user");
		}

		Rooms.update({
			_id: roomId
		}, {
			$set: {
				currentlyPlaying: "-"
			}
		});
	},
	'skipTrack': function(roomId) {
		var currentRoom = Rooms.findOne({
			_id: roomId
		});

		// Move first track to end of array and set currentlyPlaying
		currentRoom.tracks.push(currentRoom.tracks.shift());
		Rooms.update({
			_id: roomId
		}, {
			$set: {
				tracks: currentRoom.tracks,
				currentlyPlaying: currentRoom.tracks[0]
			}
		});
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

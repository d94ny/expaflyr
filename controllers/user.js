var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var crypto = require('crypto');
var Assos = require('./assos');
var Event = require('./event');


// Returns wether the cookie is

// Handle login
function loggedIn(req){

	// verify if we have a logged in user
	return (req.cookies.dopeasslistuser!==undefined && req.cookies.dopeasslistuser != "");
}

// Get username
function getUsername(req){

	var username = new Buffer(req.cookies.expauser, 'hex').toString('utf8');
	return username;

}

// Get user information
function get(username , callback) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	callback(true, "Error connecting");
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var users = db.collection('users');
      	users.find({username : username }).toArray(function(err,documents){

	      	if(err) {
	      		callback(true, "Error querying");
	      		return;
	      	}

	      	// If not error occured
	      	callback(false, documents);
	      	return;

	    });

    });
}

// Adds a specific amount of kudos to a user
function kudos(username, kudos) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	console.log(err);
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var users = db.collection('users');
      	users.update( { username: username }, { $inc: { kudos: parseInt(kudos) } }, { multi: false }, function(err,documents){

            if(err) {
            	console.log(err);
            	return;
            }

	    });

    });

}

// Adds an activity event to a user
// Activity are Public : only shown to others
function addActivity(username, activity) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	console.log(err);
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var users = db.collection('users');
      	users.update( { username: username }, { $push: { activity: activity } }, { multi: false }, function(err,documents){

            if(err) {
            	console.log(err);
            	return;
            }

	    });

    });

}

// Adds a Curriculum event to a user
// Curriculum are Private : only shown to you
function addCurriculum(username, curriculum) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	console.log(err);
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var users = db.collection('users');
      	users.update( { username: username }, { $push: { curriculum: curriculum } }, { multi: false }, function(err,documents){

            if(err) {
            	console.log(err);
            	return;
            }

	    });

    });

}


function login(username, password, callback) {

	// hash the password
	var hashed = crypto.createHash('sha1').update(password).digest("hex");

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
	MongoClient.connect(url, function(err, db) {

		// Handle possible connection error
		if(err) {
		  callback(false);
		  return;    
		}

		// No connection error
		var users = db.collection('users');
		users.find({username : username , password : hashed }).toArray(function(err,documents){

			if(err) {
				callback(false);
		    	return;
			}

			// Return if we have a match
			callback(documents.length>0);
			return;

		});

	});

}

// Add 'friend' as a friend to user
// Or removes him
function addFriend(user, friend, callback) {

	// Make sure the other person exists.
	exists(friend, function(exists){

		if(!exists) {
			callback(false);
			return;
		}

		// Friend does exits
		// get user friends list
		get(user, function(err, documents){

			if(err||documents.length<1) {
				callback(false);
				return;
			}

			var friends = documents[0].friends;
			// action tells wether we removed or added the friend
			var action;

			if(!friends||friends===undefined) {
				friends = [friend];
				action = 1;
			} else {

				// If friends is defined  :
				var index = friends.indexOf(friend);
				if(index===-1) { 
					friends.push(friend);
					action = 1;
				} else { 
					friends.splice(index,1);
					action = -1;
				}

			}

			// Now update it
			var url = format("mongodb://127.0.0.1/expadb");
		    MongoClient.connect(url, function(err, db) {
		      
		      	if(err) {
		        	console.log(err);
		        	return;
		      	}

		      	// We are now connected to the MongoDB db 
		      	var users = db.collection('users');
		      	users.update( { username: user }, { $set: { friends: friends } }, { multi: false }, function(err,documents){

		            if(err) {
		            	callback(false);
		            	return;
		            }

		            callback(action);
		            return;

		        });

		    });

		});

	});

}

// follow an assos
// Or unfollow it
function follow(user, assos, callback) {

	// Make sure the other person exists.
	Assos.exists(assos, function(exists){

		if(!exists) {
			callback(false);
			return;
		}

		// Friend does exits
		// get user friends list
		get(user, function(err, documents){

			if(err||documents.length<1) {
				callback(false);
				return;
			}

			var a = documents[0].assos;
			// action tells wether you follo or unfollow
			var action;

			if(!a||a===undefined) {
				a = [assos];
				action = 1;
			} else {

				// If friends is defined  :
				var index = a.indexOf(assos);
				if(index===-1) {
					a.push(assos);
					action = 1;
				} else {
					a.splice(index,1);
					action = -1;
				}

			}

			// Now update it
			var url = format("mongodb://127.0.0.1/expadb");
		    MongoClient.connect(url, function(err, db) {
		      
		      	if(err) {
		        	console.log(err);
		        	return;
		      	}

		      	// We are now connected to the MongoDB db 
		      	var users = db.collection('users');
		      	users.update( { username: user }, { $set: { assos: a } }, { multi: false }, function(err,documents){

		            if(err) {
		            	callback(false);
		            	return;
		            }

		            callback(action);
		            return;

		        });

		    });

		});

	});

}

// User attends an event
// Just add eventid to list
function attends(user, eventid, callback) {

	// Make sure the other person exists.
	Event.exists(eventid, function(exists){

		if(!exists) {
			callback(false);
			return;
		}

		// Event does exits
		// get user event list
		get(user, function(err, documents){

			if(err||documents.length<1) {
				callback(false);
				return;
			}

			// Action defines wether we added or removed the event
			// 1 : added
			// -1 : removed 
			var action;
			var event_list = documents[0].events;

			if(!event_list||event_list===undefined) {
				event_list = [eventid];
				action = 1;
			} else {

				// If event list is defined  :
				var index = event_list.indexOf(eventid);
				if(index===-1) {
					event_list.push(eventid);
					action = 1;
				} else {
					event_list.splice(index,1);
					action = -1;
				}

			}

			// Now update it
			var url = format("mongodb://127.0.0.1/expadb");
		    MongoClient.connect(url, function(err, db) {
		      
		      	if(err) {
		        	console.log(err);
		        	return;
		      	}

		      	// We are now connected to the MongoDB db 
		      	var users = db.collection('users');
		      	users.update( { username: user }, { $set: { events: event_list } }, { multi: false }, function(err,documents){

		            if(err) {
		            	callback(false);
		            	return;
		            }

		            callback(action);
		            return;

		        });

		    });

		});

	});

}


function areFriends(user, friend, callback){

	get(user, function(err, documents){

		if(err||documents.length<1) {
			callback(false);
			return;
		}

		var friends = documents[0].friends;
		if(!friends||friends===undefined) callback(false);
		else callback(friends.indexOf(friend)!==-1);
		return;

	});
}

function isFollowing(user, assos_name, callback){

	get(user, function(err, documents){

		if(err||documents.length<1) {
			callback(false);
			return;
		}

		var assos = documents[0].assos;
		if(!assos||assos===undefined) callback(false);
		else callback(assos.indexOf(assos_name)!==-1);
		return;

	});
}

function isAttending(user, eventid, callback){

	get(user, function(err, documents){

		if(err||documents.length<1) {
			callback(false);
			return;
		}

		var event_list = documents[0].events;
		if(!event_list||event_list===undefined) callback(false);
		else callback(event_list.indexOf(eventid)!==-1);
		return;

	});
}

// Returns wether or not a user exists
function exists(user, callback) {

	// Exists is just a get which already handles the result
	// for you
	get(user, function(err, documents){

		if(err) {
			callback(false);
			return;
		}

		callback(documents.length>0);
		return;

	});
}

// Get activity of all friends
// No getter for curriculum needed since private
function getActivities(friends, callback) {

	var acc = [];
	
	(function next(){

		// if friends is not an array anymore (because we handled all friends)
		// return our array
	    if (!friends.length) return callback(false, acc);

	    // else get the latest friend
	    var friend = friends.pop();
	    get(friend, function(err, documents){

			if(err||documents.length<1) {
				// We have an error
				return callback(true, err);
			}

			// Get the activity of our friend
			var a = (documents[0].activity) ? documents[0].activity : [];
			// Add all his items to our current list
			acc = acc.concat(a);

			// Call this function again
			next();

		});

	})();
}


// EXPOSRTS
exports.loggedIn = loggedIn;
exports.getUsername = getUsername;
exports.get = get;
exports.kudos = kudos;
exports.login = login;
exports.addFriend = addFriend;
exports.exists = exists;
exports.areFriends = areFriends;
exports.isFollowing = isFollowing;
exports.follow = follow;
exports.attends = attends;
exports.isAttending = isAttending;
exports.addActivity = addActivity;
exports.getActivities = getActivities;
exports.addCurriculum = addCurriculum;

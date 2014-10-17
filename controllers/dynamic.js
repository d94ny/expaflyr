// DYNAMIC FUNCTION USED FOR :
// profile.jade
// assos.jade
// event.jade

var User = require('./user');
var Event = require('./event');
var Assos = require('./assos');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

// Dynamically attend
// Someone attends an event
exports.attend = function(req, res) {

  // make sure we are logged in
  if(!User.loggedIn(req)){
    res.write(JSON.stringify({ err : true, message : "You are not logged in !" }));
    res.end();
    return;
  }

  try {
    var username = User.getUsername(req);
  } catch(e) {
    res.write(JSON.stringify({ err : true, message : "You are not logged in !" }));
    res.end();
    return;
  }

  // Now we need to add kudos to :
  // - that user +5
  // - the creator +1
  // - the assossiation +1

  // get info about event
  // So we can add kudos to creator and assos
  var eventid = req.body.eventid;

  Event.get(eventid, function(err, documents){

      if(err) {

        res.write(JSON.stringify({ err : true, message : "Error with event" }));
        res.end();
        return;

      }

      if(documents.length<1) {

        res.write(JSON.stringify({ err : true, message : "Event no longer exists" }));
        res.end();
        return;

      }

      // We have all the data ! 
      var event = documents[0];

      // Finally add/or remove event to list of user
      User.attends(username, eventid, function(success){

        if(!success) {
          res.write(JSON.stringify({ err : true, message : "Error" }));
          res.end();
          return;
        }

        // Success tells wether or not we added or removed the event
        // 1 : we attend
        // -1 : we cancel

        // Per default we added
        var message = "You are attending this event";
        var button = "Cancel";

        if(success == 1) {

          // We are attending the event
          // Leave default message/button

          // Add kudos
          User.kudos(username, 5);
          if(event.creator) {

            User.kudos(event.creator, 1); // In case we have a creator

            // And also a curriculum (private !)
            // To say someone attends one of your events
            var ccurriculum = {
              kind : "attendsYour",
              time : new Date().getTime(),
              user : username,
              content : {
                name : event.name,
                kudos : 1
              }
            };

            User.addCurriculum(event.creator, ccurriculum);

          }
          if(event.assos) Assos.prestige(event.assos, 1); // In case we have an assos

          // Now create an activity for friends (public !)
          // To say to your friends that you go there
          var activity = {
            kind : "attends",
            time : new Date().getTime(),
            user : username,
            content : {
              event : event
            }
          };

          User.addActivity(username, activity);

          // And also a curriculum (private !)
          // to say how much kudos you got for that
          var curriculum = {
            kind : "attend",
            time : new Date().getTime(),
            user : "you",
            content : {
              name : event.name,
              kudos : 5
            }
          };

          User.addCurriculum(username, curriculum);

        } else if(success == -1) {

          // We canceled the event
          // Change default message/button
          message = "You canceled this event";
          button = "I attend";

          // Remove kudos
          User.kudos(username, -5);
          if(event.creator) User.kudos(event.creator, -1); // In case we have a creator
          if(event.assos) Assos.prestige(event.assos, -1); // In case we have a assos

        }

        // Redirect to event page
        res.write(JSON.stringify({ err : false, message : message, button : button }));
        res.end();
        return;

      });

  });

}

// Function to add friends
// Called dynamically
exports.addfriends = function(req, res){

  // Get content
  var input = req.body;

  // Make sure we are logged in and have the input
  if(!User.loggedIn(req)||!input.friend) {
    res.write(JSON.stringify({ err : true, message : "You are not logged in !" }));
    res.end();
    return;
  }

  try {
    var u = User.getUsername(req);
  } catch(e) {
    res.write(JSON.stringify({ err : true, message : "You are not logged in !" }));
    res.end();
    return;
  }

  User.addFriend(u, input.friend, function(success){

    if(!success){
      res.write(JSON.stringify({ err : true, message : "Error" }));
      res.end();
      return;
    }

    // See attend(...) for comments

    var message = "Added "+input.friend+" as friend";
    var button = "Remove";

    // Add kudos
    if(success == 1 ) {

      User.kudos(u , 5);
      User.kudos(input.friend, 20);

      // Add a cirruculum to both
      var curriculum = {
        kind : "addfriend",
        time : new Date().getTime(),
        user : "you",
        content : {
          kudos : 5,
          friend : input.friend
        }
      };
      var curriculum2 = {
        kind : "addfriend",
        time : new Date().getTime(),
        user : u,
        content : {
          kudos : 20,
          friend : "you"
        }
      };

      User.addCurriculum(u, curriculum);
      User.addCurriculum(input.friend, curriculum2);

    } else if( success == -1) {

      message = "Removed "+input.friend+" from friends";
      button = "Add as friend";
      User.kudos(u,-5);
      User.kudos(input.friend, 20);
    }

    res.write(JSON.stringify({ err : false, message : message , button : button }));
    res.end();

  });

}

// Dynamically follow some assosciation
exports.follow = function(req, res){

  // Get content
  var input = req.body;

  // Make sure we are logged in and have the input
  if(!User.loggedIn(req)||!input.assos) {
    res.write(JSON.stringify({ err : true, message : "Missing data" }));
    res.end();
    return;
  }

  try {
    var u = User.getUsername(req);
  } catch(e) {
    res.write(JSON.stringify({ err : true, message : "You are not logged in !" }));
    res.end();
    return;
  }

  User.follow(u, input.assos, function(success){

    if(!success){
      res.write(JSON.stringify({ err : true, message : "Error" }));
      res.end();
      return;
    }

    // See attend(...) for comments

    var message = "You now follow "+input.assos;
    var button = "Unfollow";

    // Add kudos
    if(success == 1 ) {

      User.kudos(u, 5);
      Assos.prestige(input.assos, 20);

      // add circulum to user
      var curriculum = {
        kind : "follow",
        time : new Date().getTime(),
        user : "you",
        content : {
          kudos : 5,
          assos : input.assos
        }
      };

      User.addCurriculum(u, curriculum);

    } else if( success == -1) {
      message = "You unfollowed "+input.assos;
      button = "Follow";
      User.kudos(u,-5);
      Assos.prestige(input.assos, -20);
    }

    res.write(JSON.stringify({ err : false, message : message , button : button }));
    res.end();
    return;

  });

}

exports.search = function(req,res) {


  // get the search keyword
  var keyword = req.body.keyword;

  // Query mongo db for this keyword
  // Connect to database
  var url = format("mongodb://127.0.0.1/expadb");
  MongoClient.connect(url, function(err, db) {
    
    if(err) {
      res.write(JSON.stringify({ err : true, message : "Error connecting" }));
      res.end();
      return;
    }

    // We are now connected to the MongoDB db
    var users = db.collection('users');
    users.find({username : {$regex: keyword, $options: 'i'} }).limit(10).toArray(function(err,documents){

      if(err) {
        res.write(JSON.stringify({ err : true, message : "Error querying" }));
        res.end();
        return;
      }

      // If not error occured
      // Query the events
      var users_response = documents;

      var events = db.collection('events');
      events.find({name : {$regex: keyword, $options: 'i'}}).limit(10).toArray(function(err,documents){

        if(err) {
          res.write(JSON.stringify({ err : true, message : "Error querying" }));
          res.end();
          return;
        }

        // If not error occured
        // Query the events
        var events_response = documents;

        // All results together
        var total = events_response.concat(users_response);
        total.sort().slice(0,9);

        res.write(JSON.stringify({ err : false, message : total }));
        res.end();
        return;

      });

    });

  });

}
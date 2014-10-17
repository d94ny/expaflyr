var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var User = require('./user');
var Event = require('./event');
var Numbers = require('./numbers');
var Assos = require('./assos');

/* Exports gives others the permission to use 
   this file as a module.
   ex :
   var m = require('route');
   m.myFunc1();
*/


// Default Function to handle rendering
// callback for all res.render() calls
function handleRender(res, err, html){

  // If an error occured while rendering
  if(err) {
    
    // render panic as response
    res.render('panic');
    console.log(err);

  // Else just send rendered html
  } else res.send(html);

}

// Panic function
exports.panic = function(req, res){

  // Render panic function without callback to stay coherant
  res.render('panic');

}

// 404 function
exports.notfound = function(req, res){

  // Render panic function without callback to stay coherant
  res.render('404');
  
}

// Handle favicon function
exports.favicon = function(req, res){
  return;
}

// Index page 
exports.index = function(req, res) {

    // Check if loged in or not
    if(User.loggedIn(req)){
      // User is logged in, redirect him to his page
      res.redirect("/feed");
      return;

    }

    // User is not logged in
  	res.render('index', {
      title: 'index',
      header: 'Explore events',
    }, function(err, html){ handleRender(res, err, html) });

}

// User page 
// render the user page as response
exports.user = function(req, res) {
  	
    // Check if logged in
    if(!User.loggedIn(req)) {
      res.redirect('/');
      return;
    }

    var username = User.getUsername(req);

    // Else get user info
    User.get(username, function(err, documents){

      if(err) {

        console.log(documents);
        res.render('panic');
        return;

      }

      if(documents.length<1) {

        // We have an invalid cookie, destroy it
        res.clearCookie('expauser');
        res.redirect('/');
        return;

      }

      var user = documents[0];

      res.render('user', {
        title : user.username,
        header : "Welcome " + user.username,
        username : user.username,
        kudos : (user.kudos) ? Numbers.toSpace(user.kudos) : 0,
        friends : (user.friends) ? Numbers.toSpace(user.friends.length) : 0,
        follows : (user.assos) ? Numbers.toSpace(user.assos.length) : 0,
      }, function(err, html){ handleRender(res, err, html) });

    });

}

// User page 
// render the user page as response 
exports.profile = function(req, res) {

    var username = req.params.user;

    // If user is trying to view own profile redirect him
    // to his user page
    if(User.loggedIn(req)&&User.getUsername(req)==username) {
      res.redirect('/u');
      return;
    }

    // Get info of person we see
    User.get(username, function(err, documents){

      if(err) {

        console.log(documents);
        res.render('panic');
        return;

      }

      if(documents.length<1) {

        res.render('404');
        return;

      }

      // We get the user
      var user = documents[0];

      // Now we still need to render the 'friend' button accordingly
      // Here are the scenarios :
      // 1. The user is not logged in : no button
      // 2. The user is looged in : no friend : 'add as friend' button
      // 3. The user is logged in : friend : 'remove' button
      
      if(!User.loggedIn(req)){

        res.render('profile', {
          title : user.username,
          header : user.username,
          username : user.username,
          kudos : (user.kudos) ? Numbers.toSpace(user.kudos) : 0,
          friend : 1
        }, function(err, html){ handleRender(res, err, html) });

        return;

      }

      try {
        var u = User.getUsername(req);
      } catch(e) {
        res.redirect('/panic');
        return;
      }
      
      // Else the user is logged in
      // Check if in his friends
      User.areFriends(u, username, function(friends){

        res.render('profile', {
          title : user.username,
          header : user.username,
          username : user.username,
          kudos : (user.kudos) ? Numbers.toSpace(user.kudos) : 0,
          friend : (friends) ? 3 : 2 
        }, function(err, html){ handleRender(res, err, html) });

        return;

      });

    });

}

// Assos page 
// render the assos page as response 
exports.assos = function(req, res) {

    var assos_name = req.params.assos;

    // Get info of person we see
    Assos.get(assos_name, function(err, documents){

      if(err) {

        console.log(documents);
        res.render('panic');
        return;

      }

      if(documents.length<1) {

        res.render('404');
        return;

      }

      // We get the user
      var a = documents[0];

      // Now we still need to render the 'friend' button accordingly
      // Here are the scenarios :
      // 1. The user is not logged in : no button
      // 2. The user is looged in : no friend : 'add as friend' button
      // 3. The user is logged in : friend : 'remove' button
      
      if(!User.loggedIn(req)){

        res.render('assos', {
          title : a.username,
          header : a.username,
          username : a.username,
          prestige : (a.prestige) ? Numbers.toSpace(a.prestige) : 0,
          following : 1
        }, function(err, html){ handleRender(res, err, html) });

        return;

      }

      try {
        var u = User.getUsername(req);
      } catch(e) {
        res.redirect('/panic');
        return;
      }
      
      // Else the user is logged in
      // Check if in his friends
      User.isFollowing(u, assos_name, function(follows){

        res.render('assos', {
          title : a.username,
          header : a.username,
          username : a.username,
          prestige : (a.prestige) ? Numbers.toSpace(a.prestige) : 0,
          following : (follows) ? 3 : 2 
        }, function(err, html){ handleRender(res, err, html) });

        return;

      });

    });

}

// Feed page 
// render the feed page as response 
exports.feed = function(req, res) {

    // Check if logged in
    if(!User.loggedIn(req)) {
      res.redirect('/');
      return;
    }

    var username = User.getUsername(req);

    // Else get user info
    User.get(username, function(err, documents){

      if(err) {

        res.render('panic');
        return;

      }

      if(documents.length<1) {

        // We have an invalid cookie, destroy it
        res.clearCookie('expauser');
        res.redirect('/');
        return;

      }

      // Get the user
      var user = documents[0];

      // Now get his curriculum

      // curriculum : private, one shown to you
      // activity : public , only shown to others
      var user_curriculum = (user.curriculum)? user.curriculum : [] ;
      
      // Now get the friends
      User.getActivities(user.friends, function(err, friends_activity){

        if(err) {

          console.log(documents);
          res.render('panic');
          return;

        }

        // We now have all the friends activities

        // remove duplicates
        friends_activity
        
        // Combine all the similar ones into one post

        // Now get the ones from the assos
        Assos.getActivities(user.assos, function(err, assos_activity){

          if(err) {

            console.log(documents);
            res.render('panic');
            return;

          }

          // Merge them (wrongly now called activity)
          var activity = user_curriculum.concat(friends_activity.concat(assos_activity));
          activity.sort(function(a, b){
            return (b.time - a.time);
          });

          res.render('feed', {
            title: "feed",
            header: "Your feed",
            activity : activity
          }, function(err, html){ handleRender(res, err, html) });

        });

      });

    });

}

// Create new event page
// render editor page as response
exports.new = function(req, res) {

    if(!User.loggedIn(req)){
      res.redirect('/');
      return;
    }

    res.render('editor', {
      title: "New event",
      header: "New event",
    }, function(err, html){ handleRender(res, err, html) });

}

// Event page 
exports.event = function(req, res) {

    // Get the id using Buffer Object 
    var event_id = req.params.hex;

    // Verify if id is a number 
    if(event_id===''||event_id===null||event_id.length!=24) {
      res.render('404');
      return;
    }

    // Connect to databse expadb 
    Event.get(event_id, function(err, documents){

      if(err) {

        console.log(documents);
        res.render('panic');
        return;

      }

      if(documents.length<1) {

        res.render('404');
        return;

      }

      // We have all the data ! 
      var event = documents[0];

      var time = new Date(event.date);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var days = ['Sat', 'Mon','Tues','Weds','Thurs','Fri','Sun'];
      var day = days[time.getDay()];
      var date = time.getDate();
      var month = months[time.getMonth()];
      
      // Convert time to American Format 
      var hours = time.getHours();
      //it is pm if hours from 12 onwards
      suffex = (hours >= 12)? 'pm' : 'am';
      //only -12 from hours if it is greater than 12 (if not back at mid night)
      hours = (hours > 12)? hours -12 : hours;
      //if 00 then it is 12 am
      hours = (hours == '00')? 12 : hours;

      // We also need to know if the person is going to the event or not
      // Now we still need to render the 'attend' button accordingly
      // Here are the scenarios :
      // 1. The user is not logged in : no button
      // 2. The user is looged in : not going : 'attend' button
      // 3. The user is logged in : going : 'remove' button

      if(!User.loggedIn(req)) {

        res.render('event', {
          title: event.name,
          header: event.name,
          eventid : event_id,
          location : event.location,
          sections : event.sections, /* Sections is an array ex : [ "SV", "MX" , "IC"] */
          date : Numbers.toDate(date) + " " + day + " "+ month,
          time : Numbers.toDate(hours) + " : " + Numbers.toDate(time.getMinutes()) + " " + suffex,
          assos : event.assos,
          attends : 1,
        }, function(err, html){ handleRender(res, err, html) });

        return;

      }

      try {
        var u = User.getUsername(req);
      } catch(e) {
        res.redirect('/panic');
        return;
      }
      
      // Else the user is logged in
      // Check if in his friends
      User.isAttending(u, event_id, function(attends){

        res.render('event', {
          title: event.name,
          header: event.name,
          eventid : event_id,
          location : event.location,
          sections : event.sections, /* Sections is an array ex : [ "SV", "MX" , "IC"] */
          date : Numbers.toDate(date) + " " + day + " "+ month,
          time : Numbers.toDate(hours) + " : " + Numbers.toDate(time.getMinutes()) + " " + suffex,
          assos : event.assos,
          attends : (attends)? 3 : 2,
        }, function(err, html){ handleRender(res, err, html) });

        return;

      });

    });
    
    // Don't make a header here 
}

// resolve favicon problem 
exports.favicon = function(req, res){
	return;
}

// Login
exports.login = function(req, res){

  if(User.loggedIn(req)){
    res.redirect('/feed');
    return;
  }
  // get the input
  var input = req.body;
  var username = input.username;
  var password = input.password;


  User.login(username, password, function(success){

    if(!success) {

      // redirect him
      res.render('index', {
        title: 'index',
        header: 'Wrong credentials',
      }, function(err, html){ handleRender(res, err, html) });

      return;

    } else {

      // Create a cookie
      res.cookie('expauser', new Buffer(username).toString('hex'), { maxAge: 2592000*1000, httpOnly: true });
      res.redirect('/feed');
      return;

    }

  });

}

// Logout
exports.logout = function(req, res) {

  res.clearCookie('expauser');
  res.redirect('/');

}

// Save new event
exports.add = function(req, res){

  if(!User.loggedIn(req)){
    res.redirect('/');
    return;
  }

  // get input data
  var input = req.body;

  var name = input.name;
  var location = input.location;
  var assos = (input.assos)? input.assos : "expa" ;
  var sections = (input.sections&&input.sections.length<10) ? input.sections : ["all"];
  var day = (isNaN(input.day))? 01 : parseInt(input.day);
  var month = (isNaN(input.month))? 01 : parseInt(input.month);
  var time_hours = (isNaN(input.time_hours)) ? 09 : parseInt(input.time_hours);
  var time_minutes = (isNaN(input.time_minutes)) ? 00 : parseInt(input.time_minutes);
  var time_suffix = input.time_suffix;

  // if(!name||!location||!time_suffix||!time_hours||!time_minutes||day>31||month>12||time_hours>12||minutes>60||day<0||month<0) {
  if(!name||!assos||!location||day>31||month>12||time_hours>12||time_minutes>60||day<0||month<0) {

    res.render('editor', {
      title: "New event",
      header: "Please fill everything in",
    }, function(err, html){ handleRender(res, err, html) });
    return;

  }

  var creator = User.getUsername(req);
  var date = new Date(2013, month, day, (time_suffix=="pm")? time_hours+12 : time_hours).getTime();
  Event.add(name, location, sections, date, assos, creator, function(err, event){

    if(err) {
      console.log(event);
      res.render('panic');
      return;
    }

    // Worked, give creator credit
    // +100
    if(creator) { 
      User.kudos(creator,100);

      // Add a curriculum for the user only (avoid doubles in feeds how follow both him and the assos)
      var curriculum = {
        kind : "creator",
        time : new Date().getTime(),
        user : "you",
        content : {
          name : name,
          kudos : 100
        }
      };

      User.addCurriculum(creator, curriculum);

    }
    // Also add prestige to assossiation
    // +100
    if(assos) {
      Assos.prestige(assos, 100);

      var activity = {
        kind : "throws",
        time : new Date().getTime(),
        user : assos,
        content : {
          event : { name : name, location : location , sections : sections, assos : assos, date : date , creator : creator}
        }
      };

      Assos.addActivity(assos, activity);

    }

    console.log("Id is "+event._id.toString());
    res.redirect("/"+event._id.toString());
    return;

  });

}
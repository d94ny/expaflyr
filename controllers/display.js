var User = require('./user');
var Numbers = require('./numbers');


// Function to handle rendering
function handleRender(res, err, html){

  // If an error occured while rendering
  if(err) {
    
    // render panic as response
    res.render('panic');
    console.log(err);

  // Else just send rendered html
  } else res.send(html);

}

// Display Kudo history
exports.history = function(req, res) {
    
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

      res.render('history', {
        title : user.username,
        header : "Welcome " + user.username,
        username : user.username,
        kudos : (user.kudos) ? Numbers.toSpace(user.kudos) : 0,
        history : (user.history) ? user.history : [],
      }, function(err, html){ handleRender(res, err, html) });

    });

}

// Display Friends
exports.friends = function(req, res) {
    
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

      res.render('friends', {
        title : user.username,
        header : "Welcome " + user.username,
        username : user.username,
        fnum : (user.friends) ? Numbers.toSpace(user.friends.length) : 0,
        friends : (user.friends) ? user.friends : []
      }, function(err, html){ handleRender(res, err, html) });

    });

}

// Display your Follows
exports.follows = function(req, res) {
    
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

      res.render('follows', {
        title : user.username,
        header : "Welcome " + user.username,
        username : user.username,
        fnum : (user.assos) ? Numbers.toSpace(user.assos.length) : 0,
        follows : (user.assos) ? user.assos : []
      }, function(err, html){ handleRender(res, err, html) });

    });

}
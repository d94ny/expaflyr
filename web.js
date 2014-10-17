
// PROJECT NAME : expaflyr
// PROJECT AUTHOR : Daniel Balle
// PROJECT DOMAIN : expaflyr.com
// PROEJCT PORT : 8891
var port = 8891;

// PROJECT STRUCTURE :
/*
| -- web.js
| -- packages.json
| -- Procfile
| -- views/
|    | -- 404.jade
|    | -- panic.jade
|    | -- ...
| -- public/
|    | -- css/
|    | -- js/
|    | -- img/
|    | -- other/
| -- controllers/
|    | -- route.js (router)
|	 | -- display.js (displays history for friends, follows and activity pages)
|	 | -- dynamic.js (dynamic functions for 'add'/'follow'/'attend')
|	 | -- numbers.js (renders numbers more beautiful)
|	 | -- user.js
|	 | -- assos.js
|	 | -- event.js
| -- node_modules/
*/

// TO DO :
/*
- Combine similar posts into one (ex : Dennis and 12 others liked .... )
- Make achievements and badges
- Search Function
- Update history/friends/follows page
- Events show percentage, not whatever
- Fake button

DO AS SOON AS POSSIBLE !
*/

// Import libraries 
var http = require('http');
var express = require('express');
var route = require('./controllers/route');
var dynamic = require('./controllers/dynamic');
var display = require('./controllers/display');

// Create express app 
var app = express();

// Run the app on port 8888 */
app.listen(port);
console.log('Running on '+port);

// Use gzip compression
app.use(express.compress());

// Set view engine to jade
app.set('view engine', 'jade');

// Set the location of the view files (.jade)
// Located inside /views
app.set('views', __dirname + '/views');

// Setup Express to serve static files
// Static files (css,js,images ...) are located inside /public
app.use(express.static(__dirname + '/public'));

// To parse POST requests
app.use(express.bodyParser());

// To handle Cookies
app.use(express.cookieParser());
app.use(app.router);

// GET Routes

// Static pages :
// No AJAX interaction
app.get('/', route.index);
app.get('/u', route.user);

// The three 'my' pages
app.get('/h', display.history);
app.get('/f', display.friends);
app.get('/a', display.follows);

app.get('/logout', route.logout);
app.get('/feed', route.feed);
app.get('/new', route.new);

// POST ROUTES
app.post('/add', route.add);
app.post('/login', route.login);

// AJAX ROUTES
app.post('/friends', dynamic.addfriends);
app.post('/follow', dynamic.follow);
app.post('/attend', dynamic.attend);
app.post('/search', dynamic.search);

app.get('/favicon.ico', route.favicon);
app.get('/404', route.notfound);
app.get('/panic', route.panic);

// Dynamic pages
// AJAX interaction
app.get('/:hex', route.event);
app.get('/u/:user', route.profile);
app.get('/a/:assos', route.assos);

// 404 error : needs to be at the end of the file 
app.get('*', route.notfound);


var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var crypto = require('crypto');
// Handle assossiations

// Get user information
function get(assos , callback) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
	MongoClient.connect(url, function(err, db) {
		
			if(err) {
				callback(true, "Error connecting");
				return;
			}

			// We are now connected to the MongoDB db 
			var assosiations = db.collection('assos');
			assosiations.find({username : assos}).toArray(function(err,documents){

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
function prestige(username, prestige) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
		MongoClient.connect(url, function(err, db) {
			
				if(err) {
					console.log(err);
					return;
				}

				// We are now connected to the MongoDB db 
				var assosiations = db.collection('assos');
				assosiations.update( { username: username }, { $inc: { prestige: parseInt(prestige) } }, { multi: false }, function(err,documents){

						if(err) {
							console.log(err);
							return;
						}

				});

		});

}

// Adds an activity event to a user
function addActivity(assos, activity) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	console.log(err);
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var assosiations = db.collection('assos');
      	assosiations.update( { username: assos }, { $push: { activity: activity } }, { multi: false }, function(err,documents){

            if(err) {
            	console.log(err);
            	return;
            }

	    });

    });

}

// Adds a Curriculum event to a user
// Curriculum are Private : only shown to you
function addCurriculum(assos, curriculum) {

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	console.log(err);
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var assosiations = db.collection('assos');
      	assosiations.update( { username: assos }, { $push: { curriculum: curriculum } }, { multi: false }, function(err,documents){

            if(err) {
            	console.log(err);
            	return;
            }

	    });

    });

}

// Returns wether or not an assos exists
function exists(assos, callback) {

	// Exists is just a get which already handles the result
	// for you
	get(assos, function(err, documents){

		if(err) {
			callback(false);
			return;
		}

		callback(documents.length>0);
		return;

	});
}

// Get activity of all assos
// No getter for curriculum needed since private
function getActivities(assos, callback) {

	var acc = [];
	
	(function next(){

		// if friends is not an array anymore (because we handled all friends)
		// return our array
	    if (!assos.length) return callback(false, acc);

	    // else get the latest friend
	    var asso = assos.pop();
	    get(asso, function(err, documents){

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

exports.get = get;
exports.exists = exists;
exports.prestige = prestige;
exports.addActivity = addActivity;
exports.getActivities = getActivities;
exports.addCurriculum = addCurriculum;

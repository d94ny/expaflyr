var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var format = require('util').format;
var BSON = mongo.BSONPure;

// Get user information
function get(id , callback) {

  // Check if valid id
  if(id.length!=24) {
    callback(true,"Invalif index");
    return;
  }

  try {
    var test = new BSON.ObjectID(id);
  } catch(e) {
    callback(true,"Invalid index");
    return;
  }

	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	callback(true, "Error connecting");
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var events = db.collection('events');
       	events.find({ _id : test }).toArray(function(err,documents){

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

// Check if exist or not
function exists(id , callback) {

  // Exists is just a get which already handles the result
  // for you
  get(id, function(err, documents){

    if(err) {
      callback(false);
      return;
    }

    callback(documents.length>0);
    return;

  });

}


function add(name, location, sections, date, assos, creator, callback) {

  if(!name||!location||!sections||!date||!assos||!creator||!callback) {
    callback(true, "Missing info");
    return;
  }
  
	// Connect to database
	var url = format("mongodb://127.0.0.1/expadb");
    MongoClient.connect(url, function(err, db) {
      
      	if(err) {
        	callback(true, "Connection error");
        	return;
      	}

      	// We are now connected to the MongoDB db 
      	var events = db.collection('events');
       	events.insert({name : name, location : location , sections : sections, assos : assos, date : date , creator : creator}, function(err,documents){
       		callback(err,documents[0]);
       	});

    });

}

exports.add = add
exports.get = get
exports.exists = exists
var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ossdb', server);

db.open(function(err, db){
	if(!err){
		console.log("Connect to 'ossdb' database");
		db.collection('sessions', {strict:true}, function(err, collection){
			if(err){
				console.log("The 'sessions' collection doesn't exist. this will be populated by user interaction...");
			}
		});
	}
});

exports.startSession = function(req, res) {
	// Generate session id
    var data = req.body
      , user = {
            username: data.username,
      };
    console.log('Adding session: ' + JSON.stringify(user));
    db.collection('sessions', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred with user:'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.deleteSession = function(req, res) {
    var id = req.params.id;
    console.log('Deleting session: ' + id);
    db.collection('sessions', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
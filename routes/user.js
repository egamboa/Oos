var mongo = require('mongodb');
var bcrypt = require('bcrypt-nodejs');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ossdb', server);

db.open(function(err, db){
	if(!err){
		console.log("Connect to 'ossdb' database");
		db.collection('users', {strict:true}, function(err, collection){
			if(err){
				console.log("The 'users' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
            collection.count(function (err, count) {
                console.log(count);
                if (!err && count === 0) {
                    console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                    populateDB();
                }
            });
		});
	}
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var data = req.body
      , salt = bcrypt.genSaltSync()
      , user = {
            username: data.username,
            password: bcrypt.hashSync(data.password, salt)
      };
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
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

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
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

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
    // Generate password hash
    var salt = bcrypt.genSaltSync();
    var users = [
        {
            username: "egamboa",
            password: bcrypt.hashSync('admin', salt)
        }
    ];
    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
    console.log('Iniciatilized');
};

var mongo = require('mongodb'),
crypto = require('crypto');
user = require('./user');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('oosdb', server, {safe: true});

var sessionsDB = db.collection("sessions");

db.open(function(err, db){
	if(!err){
		console.log("Connect to 'oosdb' database for sessions");
	}
});

exports.startSession = function(username, callback) {
	// Generate session id
    console.log('Adding session: ' + JSON.stringify(username));

    var current_date = (new Date()).valueOf().toString()
    ,   random = Math.random().toString()
    ,   session_id = crypto.createHash('sha1').update(current_date + random).digest('hex')
    ,   session = {'username': username, '_id': session_id};

    sessionsDB.insert(session, {safe:true}, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, result);
        } else {
            callback(err, session_id);
            console.log(result);
        }
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

exports.logginUser = function(req, res){
    user.validateLogin(req.body, function(message, status){
        if(status){
            this.session.startSession(req.body.username, function(err, session_id){
                "use strict";
                if (err){
                    res.send({
                        status: false, 
                        message: "Error inserting session, please clean your cookies and cross your fingers"
                    });
                    return false;
                }
                console.log(session_id);
                res.cookie('session', session_id);
                res.send({status: status, message: message});
            });
        }else{
            res.send({
                status: false, 
                message: "Error inserting session, please clean your cookies and cross your fingers"
            });
            return false;
        }
    });
}

exports.getUsername = function(session_id, callback) {
    "use strict";

    if (!session_id) {
        callback(Error("Session not set"), null);
        return;
    }

    sessions.findOne({ '_id' : session_id }, function(err, session) {
        "use strict";

        if (err) return callback(err, null);

        if (!session) {
            callback(new Error("Session: " + session + " does not exist"), null);
            return;
        }

        callback(null, session.username);
    });
}

exports.isLoggedIn = function(req, res, next) {
    var session_id = req.cookies.session;
    sessionsDB.findOne({ '_id' : session_id }, function(err, session){
        if (session) {
           req.username = username;
        }
        return next();
    });
}
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

exports.startSession = function(userid, callback) {
	// Generate session id
    console.log('Adding session: ' + JSON.stringify(userid));

    var current_date = (new Date()).valueOf().toString()
    ,   random = Math.random().toString()
    ,   session_id = crypto.createHash('sha1').update(current_date + random).digest('hex')
    ,   session = {'userid': userid, '_id': session_id};

    sessionsDB.insert(session, {safe:true}, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, result);
        } else {
            callback(err, session_id);
        }
    });
}

exports.deleteSession = function(req, res) {
    var id = req.cookies.session;
    console.log('Deleting session: ' + id);
    sessionsDB.remove({'_id':id}, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.cookie('session', '');
            res.send({message: 'Logout Successful'});
        }
    });
}

exports.logginUser = function(req, res){
    user.validateLogin(req.body, function(message, status, userDb){
        if(status){
            this.session.startSession(userDb._id, function(err, session_id){
                "use strict";
                if (err){
                    res.send({
                        status: false, 
                        message: "Error inserting session, please clean your cookies and cross your fingers"
                    });
                    return false;
                }
                res.cookie('session', session_id);
                res.send({status: status, message: message, user: userDb});
            });
        }else{
            res.send({
                status: status, 
                message: message
            });
            return false;
        }
    });
}

exports.getUserId = function(session_id, callback) {
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

        callback(null, session.userid);
    });
}

exports.getSessionUser = function(req, res) {
    var session_id = req.cookies.session;
    sessionsDB.findOne({ '_id' : session_id }, function(err, session){
        if (session) {
            console.log('validating session for: ' + session.userid);
            res.send(session);
        }else{
            if(session_id){
                console.log('cleaning cookie for id: ' + session_id);
                res.cookie('session', '');
            }
            res.send({message: 'No session started'});
        }
    });
}

exports.registerUser = function (req, res) {
    user.addUser(req.body, function(message, status, userDb){
        if (status) {
            this.session.startSession(userDb._id, function(err, session_id){
                "use strict";
                if (err){
                    res.send({
                        status: false, 
                        message: "Error inserting session, please clean your cookies and cross your fingers"
                    });
                    return false;
                }
                res.cookie('session', session_id);
                console.log(userDb);
                res.send({status: status, message: message, user: userDb});
            });
        }else{
            console.log(userDb);
        }
    });
}

exports.isLoggedIn = function(req, res, next) {
    var session_id = req.cookies.session;
    sessionsDB.findOne({ '_id' : session_id }, function(err, session){
        if (session) {
            req.userid = session.userid;
        }
        return next();
    });
}
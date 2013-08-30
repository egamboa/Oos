var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    user = require('./routes/user'),
    session = require('./routes/session');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 9000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser())
    app.use(express.static(path.join(__dirname, 'app')));
});

// Express middleware to populate 'req.cookies' so we can access cookies
app.use(express.cookieParser());

// Express middleware to populate 'req.body' so we can access POST variables
app.use(express.bodyParser());

var server = http.createServer(app);
io = io.listen(server);


io.configure(function () {
    io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
app.post('/user', user.addUser);
app.get('/user/:id', user.findById);
/*app.get('/user', user.findAll);
app.get('/user/:id', user.findById);
app.post('/user', user.addUser);
app.put('/user/:id', user.updateUser);
app.delete('/user/:id', user.deleteUser);
*/
io.sockets.on('connection', function (socket) {

    socket.on('message', function (message) {
        console.log("Got message: " + message);
        ip = socket.handshake.address.address;
        url = message;
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });

});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
  app.use.apply(app, arguments);
};
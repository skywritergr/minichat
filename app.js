
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var chat = require('./routes/chat');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chat/:tagId', function(req, res) {
        res.render('chat', { "title" : "Chat Sample", "room": req.param("tagId") });
    });
app.get('/users', user.list);

var server = app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server,{ log: false });
var clients = {};

var socketsOfClients = {};
io.sockets.on('connection', function(socket) {

    socket.on('room', function(room) {
        console.log('room = '+room);
        socket.join(room);
    });

    socket.on('user image', function (msg) {
        //Received an image: broadcast to all
        socket.broadcast.in(msg.room).emit('user image', msg.user, msg.data);
    });

    socket.on('set username', function(userName) {
        // Is this an existing user name?
        if (clients[userName] === undefined) {
            // Does not exist ... so, proceed
            clients[userName] = socket.id;
            socketsOfClients[socket.id] = userName;
            userNameAvailable(socket.id, userName);
            userJoined(userName);
        } else
        if (clients[userName] === socket.id) {
            // Ignore for now
        } else {
            userNameAlreadyInUse(socket.id, userName);
        }
    });

    socket.on('message', function(msg) {
        var srcUser;
        if (msg.inferSrcUser) {
            // Infer user name based on the socket id
            srcUser = socketsOfClients[socket.id];
        } else {
            srcUser = msg.source;
        }
        //console.log('sending message to room '+msg.room);
            // broadcast
            io.sockets.in(msg.room).emit('message',
                {"source": srcUser,
                    "message": msg.message,
                    "target": msg.target});
    });

    socket.on('disconnect', function() {
        var uName = socketsOfClients[socket.id];
        delete socketsOfClients[socket.id];
        delete clients[uName];

        // relay this message to all the clients

        userLeft(uName);
    });
});

function userJoined(uName) {
    Object.keys(socketsOfClients).forEach(function(sId) {
        io.sockets.sockets[sId].emit('userJoined', { "userName": uName });
    })
}

function userLeft(uName) {
    io.sockets.emit('userLeft', { "userName": uName });
}

function userNameAvailable(sId, uName) {
    setTimeout(function() {

        console.log('Sending welcome msg to ' + uName + ' at ' + sId);
        io.sockets.sockets[sId].emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(clients)) });

    }, 500);
}

function userNameAlreadyInUse(sId, uName) {
    setTimeout(function() {
        io.sockets.sockets[sId].emit('error', { "userNameInUse" : true });
    }, 500);
}

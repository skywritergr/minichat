
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
var myRoom;

var socketsOfClients = {};
io.sockets.on('connection', function(socket) {

    socket.on('room', function(room) {
        myRoom = room;
        socket.join(room);
    });

    socket.on('user image', function (msg) {
        //Received an image: broadcast to all
        socket.broadcast.in(msg.room).emit('user image', msg.user, msg.data);
    });

    socket.on('set username', function(userName, room) {
        // Is this an existing user name?
        if (clients[userName] === undefined) {
            // Does not exist ... so, proceed
            clients[userName] = socket.id;
            socketsOfClients[socket.id] = userName;
            userNameAvailable(socket.id, userName, room);
            userJoined(userName,room);
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
        var room = io.sockets.manager.roomClients[socket.id];
        delete socketsOfClients[socket.id];
        delete clients[uName];

        // relay this message to all the clients
        if(uName !== undefined){
            userLeft(uName,room);
        }
    });
});

function userJoined(uName,room) {
    io.sockets.in(room).emit('userJoined', { "userName": uName });
}

function userLeft(uName,rooms) {
    for(room in rooms)
        if (room.length > 0) { // if not the global room ''
            room = room.substr(1); // remove leading '/'
            console.log('leaving room = '+room);
            io.sockets.in(room).emit('userLeft', { "userName": uName });
        }
}

function userNameAvailable(sId, uName, room) {
    setTimeout(function() {
        console.log('Sending welcome msg to ' + uName + ' at ' + sId + ' in '+room);
        io.sockets.in(room).emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(clients)) });

    }, 500);
}

function userNameAlreadyInUse(sId, uName) {
    setTimeout(function() {
        io.sockets.sockets[sId].emit('error', { "userNameInUse" : true });
    }, 500);
}

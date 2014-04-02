var socket;
var myUserName;
var room;

function escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;");
}

function unescapeHTML(text) {
    return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#34;/g, '"');
}

function enableMsgInput(enable) {
    $('input#msg').prop('disabled', !enable);
}

function enableUsernameField(enable) {
    $('input#userName').prop('disabled', !enable);
}

function simpleAppendMessage(msg){
    var html = "<span class='allMsg'>" + msg + "</span><br/>";
    $('#msgWindow').append(html);
    $('#msgWindow').scrollTop($('#msgWindow').get(0).scrollHeight);
}

function appendNewMessage(msg) {
    var html;
    var message = escapeHTML(msg.message);


    //check emoticons
    var words = message.split(' ');
    for (var i = 0; i < words.length; ++i) {
        var word = words[i];
        var emoticon = emoticonRegistry.emoticonMap[unescapeHTML(word)];
        if (emoticon) {
            words[i] = '<img src="/emoticons/' + emoticon.image + '" title="'+emoticon.name+'" height="'+emoticon.height+'px">';
        }
    }
    message = words.join(' ');

    html = "<span class='allMsg'>" + "<strong>"+msg.source+"</strong>" + " : " + message + "</span><br/>";
    $('#msgWindow').append(html);
    $('#msgWindow').scrollTop($('#msgWindow').get(0).scrollHeight);
}

socket = io.connect();

function setFeedback(fb) {
    $('span#feedback').html(fb);
}

function setUsername() {
    myUserName = $('input#userName').val();
    socket.emit('set username', $('input#userName').val(), room);
}

function sendMessage() {
    var trgtUser = $('select#users').val();
    socket.emit('message',
        {
            "inferSrcUser": true,
            "source": "",
            "message": $('input#msg').val(),
            "target": trgtUser,
            "room": room
        });
    $('input#msg').val("");
}

function image (from, base64Image) {
    $('#msgWindow').append($('<p>').append($('<b>').text(from), '<img src="' + base64Image + '"/>'));
    $('#msgWindow').scrollTop($('#msgWindow').get(0).scrollHeight);
}

$(function() {
    var h1text = $('h2').text();
    room = h1text.substring(h1text.indexOf(':')+1,h1text.length);

    enableMsgInput(false);

    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('room', room);
    });

    socket.on('userJoined', function(msg) {
        simpleAppendMessage('*** User '+msg.userName+' has joined the room ***');
    });

    socket.on('userLeft', function(msg) {
        simpleAppendMessage('*** User '+msg.userName+' has left the room ***');
    });

    socket.on('message', function(msg) {
        appendNewMessage(msg);
    });

    socket.on('user image', function (from, base64Image) {
        $('#msgWindow').append($('<p>').append($('<b>').text(from),' : ', '<img src="' + base64Image + '"/>'));
        $('#msgWindow').scrollTop($('#msgWindow').get(0).scrollHeight);
    });

    socket.on('welcome', function(msg) {
        setFeedback("<span style='color: green'> Username available. You can begin chatting.</span>");
        enableMsgInput(true);
        enableUsernameField(false);
    });

    socket.on('error', function(msg) {
        if (msg.userNameInUse) {
            setFeedback("<span style='color: red'> Username already in use. Try another name.</span>");
        }
    });

    $('input#userName').change(setUsername);
    $('input#userName').keypress(function(e) {
        if (e.keyCode == 13) {
            setUsername();
            e.stopPropagation();
            e.stopped = true;
            e.preventDefault();
        }
    });

    $('input#msg').keypress(function(e) {
        if (e.keyCode == 13) {
            sendMessage();
            e.stopPropagation();
            e.stopped = true;
            e.preventDefault();
        }
    });

    $('#imagefile').on('change', function(e){
        //Get the first (and only one) file element
        //that is included in the original event
        var file = e.originalEvent.target.files[0],
            reader = new FileReader();
        //When the file has been read...
        reader.onload = function(evt){
            //Because of how the file was read,
            //evt.target.result contains the image in base64 format
            //Nothing special, just creates an img element
            //and appends it to the DOM so my UI shows
            //that I posted an image.
            //send the image via Socket.io
            socket.emit('user image', {"data":evt.target.result,
                                       "user":$('input#userName').val(),
                                        "room": room}
            );
            image($('input#userName').val()+' : ',evt.target.result);
        };
        //And now, read the image and base64
        reader.readAsDataURL(file);
    });
});
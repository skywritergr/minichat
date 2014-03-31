/**
 * Created by gstefanis on 09/03/2014.
 */
var siteURL = 'http://minichat.co/'

function createUID(){
    var delim = '';

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}

function newChat() {
    window.open(siteURL+'chat/'+createUID(),"_self");
}

function enterChat() {
    var room = $('#chatname').val();
    window.open(siteURL+'chat/'+room,"_self");
}
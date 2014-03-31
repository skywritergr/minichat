/**
 * Created by gstefanis on 06/03/2014.
 */

exports.main = function(req, res){
    res.render('chat', { "title" : "Chat Sample" });
    console.log(req);
};